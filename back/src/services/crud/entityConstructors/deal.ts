import { Deal } from 'src/entities/deal.entities';
import { User } from 'src/entities/user.entities';

export class ArrayDeal extends Array<Deal> {
  constructor(deals: Deal[]) {
    super(...deals.map((deal) => new Deal(deal)));
  }
}
