import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UserSignupDto {
  @ApiProperty({
    description: 'email',
    example: 'exampl@gmail.com',
    required: true,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'firstName',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  public first_name: string;

  @ApiProperty({
    description: 'lastName',
    example: 'Solomon',
    required: false,
  })
  @IsOptional()
  @IsString()
  public last_name: string;

  @ApiProperty({
    description: 'password',
    example: 'ASSDssdd23@',
    required: false,
  })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  public password: string;
}
