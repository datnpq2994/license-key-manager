import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { License } from '../licenses/license.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => License, (license) => license.product)
  licenses: License[];
}
