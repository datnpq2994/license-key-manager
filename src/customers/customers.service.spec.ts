import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';

const mockCustomerRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((customer) =>
      Promise.resolve({ id: Date.now(), ...customer }),
    ),
  find: jest.fn().mockImplementation(() => Promise.resolve([])),
  findOneBy: jest
    .fn()
    .mockImplementation(({ id }) =>
      Promise.resolve({ id, name: 'Test Customer' }),
    ),
};

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a customer', async () => {
    const customerDto = { name: 'New Customer' };
    expect(await service.create(customerDto.name)).toEqual({
      id: expect.any(Number),
      ...customerDto,
    });
  });

  it('should find all customers', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should find one customer by id', async () => {
    const id = 1;
    expect(await service.findOne(id)).toEqual({ id, name: 'Test Customer' });
  });
});
