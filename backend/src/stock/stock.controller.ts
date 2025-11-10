import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { StockInDto, StockOutDto, StockMovementQueryDto } from './dto/stock.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('stock')
@UseGuards(RolesGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('in')
  @Roles(Role.ADMIN, Role.STOREKEEPER)
  stockIn(@Body() stockInDto: StockInDto, @Request() req) {
    return this.stockService.stockIn(stockInDto, req.user.id);
  }

  @Post('out')
  @Roles(Role.ADMIN, Role.STOREKEEPER)
  stockOut(@Body() stockOutDto: StockOutDto, @Request() req) {
    return this.stockService.stockOut(stockOutDto, req.user.id);
  }

  @Get('movements')
  @Roles(Role.ADMIN, Role.STOREKEEPER)
  getMovements(@Query() query: StockMovementQueryDto) {
    return this.stockService.getMovements(query);
  }

  @Get('low-stock')
  @Roles(Role.ADMIN, Role.STOREKEEPER)
  getLowStockProducts() {
    return this.stockService.getLowStockProducts();
  }
}