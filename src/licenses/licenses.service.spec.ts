import { Test, TestingModule } from '@nestjs/testing';
import { LicensesService } from './licenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { License } from './license.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const mockLicenseRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((license) =>
      Promise.resolve({ id: Date.now(), ...license }),
    ),
  find: jest.fn().mockImplementation(() => Promise.resolve([])),
  findOne: jest
    .fn()
    .mockImplementation(({ where: { key } }) =>
      key === 'valid-key'
        ? Promise.resolve({ key, product: {}, customer: {} })
        : Promise.resolve(null),
    ),
};

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'unique-key'),
}));

describe('LicensesService', () => {
  let service: LicensesService;
  let repo: Repository<License>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LicensesService,
        {
          provide: getRepositoryToken(License),
          useValue: mockLicenseRepository,
        },
      ],
    }).compile();

    service = module.get<LicensesService>(LicensesService);
    repo = module.get<Repository<License>>(getRepositoryToken(License));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a license', async () => {
    const licenseDto = { productId: 1, customerId: 1 };
    expect(
      await service.create(licenseDto.productId, licenseDto.customerId),
    ).toEqual({
      id: expect.any(Number),
      key: 'unique-key',
      product: { id: licenseDto.productId },
      customer: { id: licenseDto.customerId },
    });
  });

  it('should validate a valid license key', async () => {
    expect(await service.validate('valid-key')).toBe(true);
  });

  it('should not validate an invalid license key', async () => {
    expect(await service.validate('invalid-key')).toBe(false);
  });

  it('should assign a domain to a valid license key', async () => {
    const key = 'valid-key';
    const domain = 'example.com';
    const license = await service.assignDomain(key, domain);
    expect(license.domain).toBe(domain);
  });

  it('should throw an error when assigning a domain to an invalid license key', async () => {
    const key = 'invalid-key';
    const domain = 'example.com';

    console.log('Finding license with key:', key);
    const license = await repo.findOne({ where: { key } });
    console.log('Found license:', license);

    await expect(service.assignDomain(key, domain)).rejects.toThrow(
      'License key not found or already assigned to a domain',
    );
  });
});
