import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';

@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHome(): Promise<HomeResponseDto[]> {
    const allHomes = await this.prisma.home.findMany({
      select: {
        images: {
          select: { url: true },
          take: 1,
        },
      },
    });
    const homes = allHomes.map(
      (home) => new HomeResponseDto({ ...homes, image: home.images[0].url }),
    );
    return homes;
  }
}
