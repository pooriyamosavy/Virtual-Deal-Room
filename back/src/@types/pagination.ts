import { ApiProperty } from '@nestjs/swagger';
import { MakeNullable } from './nullishHandlers';

export type PaginationQuery = {
  page?: number | undefined;
  pagesize?: number | undefined;
};

export class PaginationRto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pagesize: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  data: any[];

  constructor(partial: MakeNullable<Partial<PaginationRto>>) {
    this.page = partial.page || 1;
    this.pagesize = partial.pagesize || 10;
    this.total = partial.total || 0;
    this.data = partial.data || [];
  }
}
