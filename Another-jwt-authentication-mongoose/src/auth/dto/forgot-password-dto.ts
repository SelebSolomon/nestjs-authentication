import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail()
  @IsString()
  email: string;
}
