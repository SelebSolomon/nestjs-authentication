import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthenticatedGuard } from './guards/auth.guards';
import { LoginDto } from '../user/dto/user-login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @UsePipes(new ValidationPipe()) // Enable validation
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req: any) {
    // Note: We add @Body() loginDto for validation
    // But we still use req.user which comes from LocalStrategy

    return new Promise((resolve, reject) => {
      req.login(req.user, (err: any) => {
        if (err) return reject(err);
        resolve({
          message: 'Login successful',
          user: req.user,
        });
      });
    });
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  async getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('session')
  @UseGuards(AuthenticatedGuard)
  async getSession(@Request() req: any) {
    return {
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      sessionID: req.sessionID,
    };
  }
}
