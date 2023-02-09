import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface Filters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  propertType?: PropertyType;
}
@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}
  async getHome(filters: Filters): Promise<HomeResponseDto[]> {
    const allHomes = await this.prisma.home.findMany({
      select: {
        images: {
          select: { url: true },
          take: 1,
        },
      },
      // where : {}
    });
    const homes = allHomes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0]?.url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });
    return homes;
  }
}
