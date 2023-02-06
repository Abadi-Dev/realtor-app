import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
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
    console.log(hashedPassword);
  }
}
