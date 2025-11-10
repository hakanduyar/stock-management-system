export enum Role {
  ADMIN = 'ADMIN',
  STOREKEEPER = 'STOREKEEPER',
  EMPLOYEE = 'EMPLOYEE',
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface Product {
  id: string;
  productCode: string;
  name: string;
  brand: string;
  minStock: number;
  currentStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  prevStock: number;
  newStock: number;
  reference: string | null;
  createdBy: string;
  createdAt: string;
  product?: {
    id: string;
    productCode: string;
    name: string;
    brand: string;
  };
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export interface CreateProductDto {
  productCode: string;
  name: string;
  brand: string;
  minStock: number;
  currentStock?: number;
}

export interface UpdateProductDto {
  name?: string;
  brand?: string;
  minStock?: number;
}

export interface StockInDto {
  productCode: string;
  quantity: number;
  reference?: string;
}

export interface StockOutDto {
  productId: string;
  quantity: number;
  reference?: string;
}