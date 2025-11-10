import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { productCode: createProductDto.productCode },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this code already exists');
    }

    return this.prisma.product.create({
      data: {
        productCode: createProductDto.productCode,
        name: createProductDto.name,
        brand: createProductDto.brand,
        minStock: createProductDto.minStock,
        currentStock: createProductDto.currentStock || 0,
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const where: any = {};

    if (query.productCode) {
      where.productCode = {
        contains: query.productCode,
        mode: 'insensitive',
      };
    }

    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive',
      };
    }

    if (query.brand) {
      where.brand = {
        contains: query.brand,
        mode: 'insensitive',
      };
    }

    return this.prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByProductCode(productCode: string) {
    return this.prisma.product.findUnique({
      where: { productCode },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}