import api from './api';
import type {
  AuthResponse,
  Product,
  StockMovement,
  CreateProductDto,
  UpdateProductDto,
  StockInDto,
  StockOutDto,
} from '@/types';

export const authService = {
  register: async (email: string, password: string, role?: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { email, password, role });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const productService = {
  getAll: async (params?: { productCode?: string; name?: string; brand?: string }): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const stockService = {
  stockIn: async (data: StockInDto) => {
    const response = await api.post('/stock/in', data);
    return response.data;
  },

  stockOut: async (data: StockOutDto) => {
    const response = await api.post('/stock/out', data);
    return response.data;
  },

  getMovements: async (params?: {
    productId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<StockMovement[]> => {
    const response = await api.get('/stock/movements', { params });
    return response.data;
  },

  getLowStock: async (): Promise<Product[]> => {
    const response = await api.get('/stock/low-stock');
    return response.data;
  },
};