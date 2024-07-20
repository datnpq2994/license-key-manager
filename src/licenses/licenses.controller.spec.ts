import { Test, TestingModule } from '@nestjs/testing';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { NotFoundException } from '@nestjs/common';

const mockLicensesService = {
  create: jest.fn().mockImplementation((productId, customerId) =>
    Promise.resolve({
      id: Date.now(),
      key: 'unique-key',
      productId,
      customerId,
    }),
  ),
  findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
  validate: jest.fn().mockImplementation((key) => {
    if (key === 'valid-key') {
      return Promise.resolve(true);
    } else {
      throw new NotFoundException('License key not found');
    }
  }),
  assignDomain: jest.fn().mockImplementation((key, domain) => {
    if (key === 'valid-key') {
      return Promise.resolve({ key, domain });
    } else {
      throw new NotFoundException(
        'License key not found or already assigned to a domain',
      );
    }
  }),
};

describe('LicensesController', () => {
  let controller: LicensesController;
  let service: LicensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicensesController],
      providers: [
        {
          provide: LicensesService,
          useValue: mockLicensesService,
        },
      ],
    }).compile();

    controller = module.get<LicensesController>(LicensesController);
    service = module.get<LicensesService>(LicensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a license', async () => {
    const result = await controller.create({ productId: 1, customerId: 1 });
    expect(result).toEqual({
      id: expect.any(Number),
      key: 'unique-key',
      productId: 1,
      customerId: 1,
    });
  });

  it('should find all licenses', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('should validate a license key', async () => {
    const result = await controller.validate({ key: 'valid-key' });
    expect(result).toEqual({ valid: true });
  });

  it('should not validate an invalid license key', async () => {
    await expect(controller.validate({ key: 'invalid-key' })).rejects.toThrow(
      'License key not found',
    );
  });

  it('should assign a domain to a valid license key', async () => {
    const result = await controller.assignDomain({
      key: 'valid-key',
      domain: 'example.com',
    });
    expect(result).toEqual({ key: 'valid-key', domain: 'example.com' });
  });

  it('should throw an error when assigning a domain to an invalid license key', async () => {
    await expect(
      controller.assignDomain({ key: 'invalid-key', domain: 'example.com' }),
    ).rejects.toThrow('License key not found or already assigned to a domain');
  });
});
