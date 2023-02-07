import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from '@prisma/client';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string,
    @Query('propertType') propertType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    return this.homeService.getHome();
  }

  @Get('/:id')
  getHome() {
    return;
  }

  @Post()
  createHome() {
    return 'created';
  }

  @Put('/:id')
  updateHome() {
    return {};
  }

  @Delete('/:id')
  deleteHome() {
    return 'deleted';
  }
}
