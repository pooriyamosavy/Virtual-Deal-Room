import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Deal } from 'src/entities/deal.entities';
import { DealCrudService } from 'src/services/crud/deal-crud.service';

@Injectable()
export class DealByIdPipe implements PipeTransform<string, Promise<Deal>> {
  constructor(private dealCrudService: DealCrudService) {}

  async transform(value: string): Promise<Deal> {
    const dealId = parseInt(value, 10);

    if (isNaN(dealId)) {
      throw new BadRequestException('Invalid deal ID');
    }

    const deal = await this.dealCrudService.getDeal({ id: dealId });
    if (!deal) {
      throw new BadRequestException('deal not found');
    }

    return deal;
  }
}
