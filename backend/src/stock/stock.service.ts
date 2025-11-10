import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockInDto, StockOutDto, StockMovementQueryDto } from './dto/stock.dto';
import { MovementType } from '@prisma/client';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async stockIn(stockInDto: StockInDto, userId: string) {
    const { productCode, quantity, reference } = stockInDto;

    const product = await this.prisma.product.findUnique({
      where: { productCode },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const prevStock = product.currentStock;
    const newStock = prevStock + quantity;

    const result = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: product.id },
        data: { currentStock: newStock },
      }),
      this.prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: MovementType.IN,
          quantity,
          prevStock,
          newStock,
          reference: reference || `Stock-IN: ${productCode}`,
          createdBy: userId,
        },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      message: 'Stock added successfully',
      product: result[0],
      movement: result[1],
    };
  }

  async stockOut(stockOutDto: StockOutDto, userId: string) {
    const { productId, quantity, reference } = stockOutDto;

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.currentStock < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`,
      );
    }

    const prevStock = product.currentStock;
    const newStock = prevStock - quantity;

    const result = await this.prisma.$transaction([
      this.prisma.product.update({
        where: { id: productId },
        data: { currentStock: newStock },
      }),
      this.prisma.stockMovement.create({
        data: {
          productId,
          type: MovementType.OUT,
          quantity,
          prevStock,
          newStock,
          reference: reference || `Stock-OUT: ${product.productCode}`,
          createdBy: userId,
        },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    const lowStock = newStock < product.minStock;

    return {
      message: 'Stock removed successfully',
      product: result[0],
      movement: result[1],
      warning: lowStock ? `Warning: Stock is below minimum level (${product.minStock})` : null,
    };
  }

  async getMovements(query: StockMovementQueryDto) {
    const where: any = {};

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    return this.prisma.stockMovement.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            productCode: true,
            name: true,
            brand: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: {
        currentStock: {
          lt: this.prisma.product.fields.minStock,
        },
      },
      orderBy: {
        currentStock: 'asc',
      },
    });
  }
}