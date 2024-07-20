import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

const mockProductRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest
    .fn()
    .mockImplementation((product) =>
      Promise.resolve({ id: Date.now(), ...product }),
    ),
  find: jest.fn().mockImplementation(() => Promise.resolve([])),
  findOneBy: jest
    .fn()
    .mockImplementation(({ id }) =>
      Promise.resolve({ id, name: 'Test Product' }),
    ),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const productDto = { name: 'New Product' };
    expect(await service.create(productDto.name)).toEqual({
      id: expect.any(Number),
      ...productDto,
    });
  });

  it('should find all products', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should find one product by id', async () => {
    const id = 1;
    expect(await service.findOne(id)).toEqual({ id, name: 'Test Product' });
  });
});
