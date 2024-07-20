import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { License } from '../licenses/license.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => License, (license) => license.customer)
  licenses: License[];
}
