import { UserType } from '@prisma/client';
import {
  IsEmail,
  MinLength,
  IsString,
  Matches,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(5)
  @IsString()
  password: string;
  @Matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, {
    message: 'Phone must be a valid number',
  })
  phone: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productKey?: string;
}

export class SignInDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;
  @IsEnum(UserType)
  userType: UserType;
}
