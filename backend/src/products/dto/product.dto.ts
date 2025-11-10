import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsInt()
  @Min(0)
  minStock: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  currentStock?: number;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  minStock?: number;
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  productCode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}