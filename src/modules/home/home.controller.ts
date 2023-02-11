import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  UpdateHomeDto,
  MessageDto,
} from './dto/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserProperties } from '../user/decorators/user.decorator';
import { Roles } from 'src/decorators/role.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minPrice') minPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      maxPrice || minPrice
        ? {
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
            ...(minPrice && { gte: parseFloat(minPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getHomes(filters);
  }

  @Get('/:id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHome(id);
  }

  @Roles(UserType.REALTOR)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserProperties) {
    return this.homeService.createHome(body, user.id);
  }
  @Roles(UserType.REALTOR)
  @Put('/:id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserProperties,
  ) {
    if (!user) throw new UnauthorizedException();

    const realtor_id = await this.homeService.getRealtorByHomeId(id);
    if (realtor_id !== user.id) throw new UnauthorizedException();

    return this.homeService.updateHome(body, id);
  }
  @Roles(UserType.REALTOR)
  @Delete('/:id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserProperties,
  ) {
    if (!user) throw new UnauthorizedException();

    const realtor_id = await this.homeService.getRealtorByHomeId(id);
    if (realtor_id !== user.id) throw new UnauthorizedException();

    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BUYER)
  @Post('/inquire/:id')
  inquire(
    @Param('id', ParseIntPipe) homeId: number,
    @User() buyer: UserProperties,
    @Body() { message }: MessageDto,
  ) {
    return this.homeService.inquire(buyer, homeId, message);
  }
}
