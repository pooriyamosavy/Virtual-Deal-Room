import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateDealDto } from './dto/createdeal.dto';
import { DealService } from './deal.service';
import { updateDealDto } from './dto/updateDeal.dto';
import { AuthUser } from 'src/decorator/auth-user.decorator';
import { User } from 'src/entities/user.entities';
import { Deal } from 'src/entities/deal.entities';
import { DealByIdPipe } from 'src/pipes/deal-by-id.pipe';
import { DealStatus } from 'src/@types/enums';
import { OptionalUserByIdPipe } from 'src/pipes/optional-user-by-id.pipe';

@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post('')
  createDeal(@Body() body: CreateDealDto, @AuthUser() user: User) {
    return this.dealService.createDeal(body, user);
  }

  @Put(':id')
  updateDeal(
    @Body() body: updateDealDto,
    @AuthUser() user: User,
    @Param('id', DealByIdPipe) deal: Deal,
  ) {
    return this.dealService.updateDeal(body, user, deal);
  }

  @Delete(':id')
  deleteDeal(@Param('id', DealByIdPipe) deal: Deal) {
    return this.dealService.deleteDeal(deal);
  }

  @Get('all')
  getAllDeals(
    @Query('creator', OptionalUserByIdPipe) creator?: User,
    @Query('description') description?: string,
    @Query('price') price?: number,
    @Query('status', new ParseEnumPipe(DealStatus, { optional: true }))
    status?: DealStatus,
    @Query('title') title?: string,
    @Query('page') page?: number,
    @Query('pagesize') pagesize?: number,
  ) {
    return this.dealService.getDeals(
      {
        creator,
        description,
        price,
        status,
        title,
      },
      {
        page,
        pagesize,
      },
    );
  }

  @Get(':id')
  getDeal(@Param('id', DealByIdPipe) deal: Deal) {
    return deal;
  }
}
