import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateDealDto } from './dto/createdeal.dto';
import { DealCrudService } from 'src/services/crud/deal-crud.service';
import { Deal } from 'src/entities/deal.entities';
import { PaginationQuery } from 'src/@types/pagination';
import { updateDealDto } from './dto/updateDeal.dto';
import { User } from 'src/entities/user.entities';
import { DealStatus } from 'src/@types/enums';

@Injectable()
export class DealService {
  constructor(private readonly dealCrudService: DealCrudService) {}

  createDeal(body: CreateDealDto, user: User) {
    const newDeal = new Deal({
      description: body.description,
      price: body.price,
      status: DealStatus.Pending,
      title: body.title,
      creator: user,
    });

    return this.dealCrudService.createDeal(newDeal);
  }

  getDeal(user: Deal, pagination: PaginationQuery) {
    return this.dealCrudService.getDeals(user, pagination);
  }

  updateDeal(newDeal: updateDealDto, user: User, deal: Deal) {
    if (deal.creator.id !== user.id) {
      throw new UnauthorizedException(
        'You dont have permission to update this deal',
      );
    }

    const UpdatedDeal = new Deal({
      ...deal,
      ...newDeal,
    });
    return this.dealCrudService.updateDeal(UpdatedDeal);
  }

  deleteDeal(deal: Deal) {
    return this.dealCrudService.deleteDeal(deal);
  }

  getDeals(
    deal: Omit<Partial<Deal>, 'id' | 'created_at' | 'updated_at'>,
    pagination: PaginationQuery,
  ) {
    return this.dealCrudService.getDeals(deal, pagination);
  }
}
