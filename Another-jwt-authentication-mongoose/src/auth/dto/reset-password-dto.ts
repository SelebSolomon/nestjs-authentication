import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsStrongPassword()
  @Matches(/^(?=.*[0-9])/, {
    message: 'password must contain at least one number',
  })
  newPassword: string;
  
  @IsString()
  resetToken: string;
}
