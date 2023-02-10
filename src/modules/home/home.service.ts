import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

interface Filters {
  city?: string;
  price: {
    lte?: number;
    get?: number;
  };
  propertType?: PropertyType;
}
interface CreateHomeProperties {
  address: string;
  number_of_bathrooms: number;
  number_of_bedrooms: number;
  city: string;
  price: number;
  land_size: number;
  propertyType: PropertyType;
  images: { url: string }[];
}
interface updateHomeProperties {
  address?: string;
  number_of_bathrooms?: number;
  number_of_bedrooms?: number;
  city?: string;
  price?: number;
  land_size?: number;
  propertyType?: PropertyType;
}

const allHomeSelect = {
  select: {
    images: {
      select: { url: true },
      take: 1,
    },
    city: true,
    address: true,
    price: true,
    land_size: true,
    propertyType: true,
    number_of_bathrooms: true,
    number_of_bedrooms: true,
    id: true,
  },
};

const getHomeByIdSelect = {
  include: {
    realtor: {
      select: {
        name: true,
        phone: true,
        email: true,
      },
    },
    images: true,
  },
};
@Injectable()
export class HomeService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomes(filters: Filters): Promise<HomeResponseDto[]> {
    const allHomes = await this.prisma.home.findMany({
      ...allHomeSelect,
      where: filters,
    });

    const homes = allHomes.map((home) => {
      const fetchedHome = { ...home, image: home.images[0]?.url };
      delete fetchedHome.images;
      return new HomeResponseDto(fetchedHome);
    });

    return homes;
  }

  async getHome(id: number) {
    const home = await this.prisma.home.findUnique({
      where: { id },
      ...getHomeByIdSelect,
    });

    return new HomeResponseDto(home);
  }

  async createHome(
    {
      price,
      propertyType,
      land_size,
      number_of_bathrooms,
      number_of_bedrooms,
      city,
      address,
      images,
    }: CreateHomeProperties,
    userId: number,
  ) {
    const home = await this.prisma.home.create({
      data: {
        price,
        number_of_bathrooms,
        number_of_bedrooms,
        address,
        city,
        propertyType,
        land_size,
        realtor_id: userId,
      },
    });
    const homeImages = images.map((img) => {
      return {
        url: img.url,
        home_id: home.id,
      };
    });

    await this.prisma.image.createMany({ data: homeImages });

    return new HomeResponseDto(home);
  }

  async updateHome(updateHomeProperties: updateHomeProperties, id: number) {
    const home = await this.prisma.home.findUnique({
      where: { id },
    });

    if (!home) {
      throw new NotFoundException();
    } else {
      const updateHome = await this.prisma.home.update({
        where: { id },
        data: updateHomeProperties,
      });
      return new HomeResponseDto(updateHome);
    }
  }

  async deleteHome(id: number) {
    const findHome = await this.prisma.home.findUnique({
      where: { id },
    });

    if (!findHome) {
      throw new NotFoundException();
    } else {
      await this.prisma.image.deleteMany({
        where: { home_id: id },
      });
      await this.prisma.home.delete({
        where: { id },
      });
    }
    return;
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prisma.home.findUnique({
      where: {
        id,
      },
    });
    if (!home) {
      throw new NotFoundException();
    } else {
      return home.realtor_id;
    }
  }
}
