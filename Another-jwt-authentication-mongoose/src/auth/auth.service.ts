import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto, SignUpResponseDto } from './dto/response.dto';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schema/refresh-token-schema';
import { v4 as uuidv4 } from 'uuid';
import { ResetToken } from './schema/reset-token-schema';
import { nanoid } from 'nanoid';
import { MailService } from './service/mail-service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    @InjectModel(ResetToken.name)
    private resetTokenModel: Model<ResetToken>,

    private jwtService: JwtService,
    private mailService: MailService,
    private roleService: RolesService,
  ) {}

  async signup(createAuthDto: CreateAuthDto): Promise<SignUpResponseDto> {
    const user = await this.userModel.findOne({
      email: createAuthDto.email,
    });

    if (user) {
      throw new ConflictException('email already exist');
    }

    // hashing the password
    const hashing = await bcrypt.hash(createAuthDto.password, 8);

    const newUser = await this.userModel.create({
      email: createAuthDto.email,
      password: hashing,
      name: createAuthDto.name,
    });

    const { password: _, ...other } = newUser.toObject();
    return {
      message: 'User signup Successfully',
      data: other,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userModel.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new UnauthorizedException('wrong credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('invalid user name or password');
    }

    const { password, ...safeUser } = user.toObject();

    const { accessToken, refreshToken } = await this.generateAccessToken(
      user._id,
    );

    return {
      message: 'Login successful',
      data: {
        id: safeUser._id.toString(),
        email: safeUser.email,
        name: safeUser.name,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenInput: string) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshTokenInput,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid user token ');
    }

    return this.generateAccessToken(token.userId);
  }

  async generateAccessToken(userId) {
    const accessToken = await this.jwtService.sign({ userId });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId) {
    const expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiryDate, token } },
      { upsert: true },
    );
  }

  async changePassword(userId, oldPassword: string, newPassword: string) {
    //find the user
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('No user found');
    }
    //compare the old password and new password
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      throw new BadRequestException('Incorrect password');
    }
    //change users password and dont forget to hash it
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    user.password = hashedPassword;
    user.save();

    return {
      message: 'password has been changed',
    };
  }

  async forgotPassword(email: string) {
    //check if that user exisits
    const user = await this.userModel.findOne({ email });

    //if user exist generate a reset link
    if (user) {
      const resetToken = nanoid(64);
      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      await this.resetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate,
      });

      await this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    //send the link to user by email nodemailer or any
    return {
      message: 'if email exist a message will be sent to the email',
    };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    // find a valid reset password link

    const token = await this.resetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    // change the password and make you save it
    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException('internal server error');
    }

    user.password = await bcrypt.hash(newPassword, 8);
    user.save();

    return {
      message: 'Password updated successfully',
    };
  }

  async getUserPermissions(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new BadRequestException();

    const role = await this.roleService.getRoleById(user.roleId.toString());
    return role?.permission;
  }
}
