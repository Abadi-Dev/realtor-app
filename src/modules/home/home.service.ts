import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHome(): Promise<HomeResponseDto[]> {
    const allHomes = await this.prisma.home.findMany();
    const homes = allHomes.map((home) => new HomeResponseDto(home));
    return homes;
  }
}
