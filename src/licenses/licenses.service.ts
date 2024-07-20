import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { License } from './license.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LicensesService {
  constructor(
    @InjectRepository(License)
    private licensesRepository: Repository<License>,
  ) {}

  async create(productId: number, customerId: number): Promise<License> {
    const key = uuidv4();
    const license = this.licensesRepository.create({
      key,
      product: { id: productId },
      customer: { id: customerId },
    });
    return this.licensesRepository.save(license);
  }

  findAll(): Promise<License[]> {
    return this.licensesRepository.find({ relations: ['product', 'customer'] });
  }

  async validate(key: string): Promise<boolean> {
    const license = await this.licensesRepository.findOne({ where: { key } });
    return !!license;
  }

  async assignDomain(key: string, domain: string): Promise<License> {
    const license = await this.licensesRepository.findOne({ where: { key } });
    if (license && !license.domain) {
      license.domain = domain;
      return this.licensesRepository.save(license);
    } else {
      throw new Error('License key not found or already assigned to a domain');
    }
  }
}
