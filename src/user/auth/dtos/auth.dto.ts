import {
  IsEmail,
  MinLength,
  IsString,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class signUpDto {
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
}
