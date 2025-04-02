import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from 'src/entities/deal.entities';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationQuery } from 'src/@types/pagination';
import { User } from 'src/entities/user.entities';
import { ArrayDeal } from './entityConstructors/deal';

@Injectable()
export class DealCrudService {
  constructor(
    @InjectRepository(Deal) private dealRepo: Repository<Deal>,
    private readonly redisService: RedisService,
  ) {}

  async createDeal(deal: Deal) {
    return this.redisService.createCallback<Deal>(
      'deal',
      { id: deal.id },
      async () => {
        return await this.dealRepo.save(deal);
      },
    );
  }

  async getDeal(dealWhere: FindOptionsWhere<Deal>) {
    return await this.redisService.getCallback<Deal>(
      'deal',
      dealWhere,
      async () => {
        return await this.dealRepo.findOne({ where: dealWhere });
      },
      Deal,
    );
  }

  async getDeals(
    userWhere: FindOptionsWhere<Deal>,
    pagination: PaginationQuery,
  ) {
    return this.redisService.getCallback<Deal[]>(
      'users',
      {
        ...userWhere,
        page: pagination.page || 1,
        pagesize: pagination.pagesize || 10,
      },
      async () => {
        return await this.dealRepo.find({
          where: userWhere,
          skip: ((pagination.page || 1) - 1) * (pagination.pagesize || 10),
          take: pagination.pagesize || 10,
        });
      },
      ArrayDeal,
    );
  }

  async updateDeal(deal: Deal) {
    return this.redisService.updateCallback<Deal>(
      'deal',
      { id: deal.id },
      async () => this.dealRepo.update(deal.id, deal),
      deal,
    );
  }

  async deleteDeal(deal: Deal) {
    return this.redisService.deleteCallback<Deal>(
      'deal',
      { id: deal.id },
      async () => this.dealRepo.remove(deal),
    );
  }
}
