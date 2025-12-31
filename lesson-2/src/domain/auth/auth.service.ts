import {
  Injectable,
  ForbiddenException,
  forwardRef,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserSigInDto } from './dto/auth-request.dto';
import * as bcrypt from 'bcrypt';
import { jwtPayLoad } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { UserSignupDto } from '../user/dto/user-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async ValidateUserByPassword(payload: UserSigInDto) {
    const { email, password } = payload;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('No user was found');
    }

    let isMatch = await this.comparePassword(password, user.password);

    if (isMatch) {
      const data = await this.createToken(user);
      await this.updateRefreshToken(user.email, data.refresh_token);
      return data;
    } else {
      throw new NotFoundException('User email or password is invalid');
    }
  }

  private async updateRefreshToken(email: string, refToken: string) {
    await this.userService.updateRefreshTokenByEmail(email, refToken);
  }

  public async validateJwtPayload(payload: jwtPayLoad) {
    const data = await this.userService.findUserByEmail(payload.email);
    // delete data?.password;
    return data;
  }

  public async logout(user: UserEntity) {
    const { id, refresh_token, email } = user;
    await this.userService.updateRefreshTokenByEmail(user.email, null);
  }

  
  public async createToken(user: UserEntity) {
    const data: JwtPayload = {
      userId: user.id,
      email: user.email,
      permissions: user.permissions,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: this.configService.get('access_token_secret'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(data, {
        secret: this.configService.get('refresh_token_secret'),
        expiresIn: '1d',
      }),
    ]);
    return {
      ...data,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
