import { ConflictException, Injectable } from '@nestjs/common';
import { signUpDto } from './dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface BodyData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async signUp({ email }: BodyData) {
    const isExists = await this.prisma.user.findUnique({
      where: {
        email: 'jmmm                                ',
      },
    });
    if (isExists) throw new ConflictException();
    return 'hello';
  }
}
