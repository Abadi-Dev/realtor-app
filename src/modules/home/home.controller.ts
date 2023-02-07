import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDto[]> {
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
