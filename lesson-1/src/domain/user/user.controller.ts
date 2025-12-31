import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() dto: createUserDTO) {
    const exisitingUser = await this.userService.findByEmail(dto.email);

    if (exisitingUser) {
      throw new ConflictException('User already exist');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 8);

    const newUser = await this.userService.create({
      ...dto,
      password: hashedPassword,
      role: dto.role || 'user',
    });

    return {
      message: 'User is created successfully',
      user: newUser,
    };
  }
}
