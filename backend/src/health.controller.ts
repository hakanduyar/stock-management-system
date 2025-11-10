import { Controller, Get } from '@nestjs/common';

@Controller()  // Boş controller: root path için
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'Stock Management API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}