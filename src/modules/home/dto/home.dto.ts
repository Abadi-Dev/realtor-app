import { PropertyType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';
export class HomeResponseDto {
  id: number;
  address: string;
  city: string;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bedrooms;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }
  listed_date: Date;
  price: number;
  land_size: number;
  property_type: PropertyType;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;
  image: string;
  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
