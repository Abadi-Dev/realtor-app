import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
interface SignUpObject {
  name: string;
  email: string;
  password: string;
  phone: string;
}
interface SignInObject {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signUp({ email, password, name, phone }: SignUpObject) {
    const isExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isExists) throw new ConflictException();

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });
    return this.generateJWT(name, user.id);
  }
  async signIn({ email, password }: SignInObject) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new HttpException('invalid credentials', 400);

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (!isValidPassword) throw new HttpException('invalid credentials', 400);

    return this.generateJWT(user.name, user.id);
  }

  //FIXME: add expires option, for now it doesnt expire for easines when testing
  private generateJWT(name: string, Id: number) {
    const token = jwt.sign(
      {
        name,
        Id,
      },
      process.env.JSON_TOKEN_KEY,
    );
    return token;
  }
}
