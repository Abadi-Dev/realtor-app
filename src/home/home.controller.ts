import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  getHomes() {
    return [];
  }

  @Get('/:id')
  getHome() {
    return 'home';
  }

  @Post()
  createHome() {
    return 'created';
  }

  @Put('/:id')
  updateHome() {
    return {};
  }

  @Delete()
  deleteHome() {
    return 'deleted';
  }
}
