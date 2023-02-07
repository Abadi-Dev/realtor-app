import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, GenerateProductKeyDto } from './dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  signUp(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) throw new UnauthorizedException();
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isvalidProductKey = bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isvalidProductKey) throw new UnauthorizedException();
    }

    return this.authService.signUp(body, userType);
  }
  @Post('/signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body);
  }
  @Post('/key')
  generateProductKey(@Body() { email, userType }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
