import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/product.entity';
import { Customer } from './customers/customer.entity';
import { License } from './licenses/license.entity';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { LicensesModule } from './licenses/licenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Product, Customer, License],
      synchronize: true,
    }),
    ProductsModule,
    CustomersModule,
    LicensesModule,
  ],
})
export class AppModule {}
