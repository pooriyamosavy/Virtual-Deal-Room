import { IsEnum, IsNumber, IsString } from 'class-validator';
import { DealStatus } from 'src/@types/enums';
import { Deal } from 'src/entities/deal.entities';

export class CreateDealDto
  implements
    Omit<
      Deal,
      'id' | 'created_at' | 'creator' | 'used_at' | 'updated_at' | 'status'
    >
{
  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  title: string;
}
