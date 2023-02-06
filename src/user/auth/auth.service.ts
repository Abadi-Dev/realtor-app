import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { User, UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
interface BodyData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signUp({ email, password, name, phone }: BodyData) {
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
    //FIXME: add expires option, for now it doesnt expire for easines when testing
    const token = jwt.sign(
      {
        name,
        Id: user.id,
      },
      process.env.JSON_TOKEN_KEY,
    );
    return token;
  }
}
