import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { MovementType } from '@prisma/client';

export class StockInDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class StockOutDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class StockMovementQueryDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsEnum(MovementType)
  type?: MovementType;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}