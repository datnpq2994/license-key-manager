import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';
import { Customer } from '../customers/customer.entity';

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @ManyToOne(() => Product, (product) => product.licenses)
  product: Product;

  @ManyToOne(() => Customer, (customer) => customer.licenses)
  customer: Customer;

  @Column({ nullable: true })
  domain: string;
}
