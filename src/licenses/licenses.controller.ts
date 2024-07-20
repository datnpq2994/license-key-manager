import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { LicensesService } from './licenses.service';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post()
  async create(@Body() body: { productId: number; customerId: number }) {
    return this.licensesService.create(body.productId, body.customerId);
  }

  @Get()
  async findAll() {
    return this.licensesService.findAll();
  }

  @Post('validate')
  async validate(@Body() body: { key: string }) {
    const valid = await this.licensesService.validate(body.key);
    if (valid) {
      return { valid };
    } else {
      throw new NotFoundException('License key not found');
    }
  }

  @Post('assign-domain')
  async assignDomain(@Body() body: { key: string; domain: string }) {
    return this.licensesService.assignDomain(body.key, body.domain);
  }
}
