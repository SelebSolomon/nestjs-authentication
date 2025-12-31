import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UserSignupDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Like, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: Logger,
    private readonly authService: AuthService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async create(userInput: UserSignupDto): Promise<UserEntity> {
    const userEntity = await this.userRepo.create();
    const { email } = userInput;
    const existingUser = await this.findUserByEmail(email.toLowerCase());

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const pass = await this.hashedPassword(userInput.password);

    const saveEntity = {
      ...userEntity,
      ...userInput,
      password: pass,
      first_name: userInput?.first_name?.toLowerCase(),
      last_name: userInput?.last_name?.toLowerCase(),
      email: userInput?.email?.toLowerCase(),
    };

    let user: UserEntity | null;
    try {
      user = await this.userRepo.save(saveEntity);
      this.logger.log('User created Successfully');
      return user;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException('User already exist with the same email');
    }
  }

  async hashedPassword(password: string) {
    return await bcrypt.hash(password, 8);
  }

  async findAllUsers() {
    return this.userRepo.find({});
  }
  
  async findUserByEmail(email: string): Promise<UserEntity> {
    await this.userRepo.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async findUserByProperty(data: FindUserDto) {
    const { email, first_name, last_name, name } = data;
    const user = await this.userRepo.find({
      where: [
        { email: Like(`%${email}%`) },
        { first_name: Like(`%${first_name}%`) },
        { last_name: Like(`%${last_name}%`) },
        { name: Like(`%${name}%`) },
      ],
    });
    return user;
  }
}
