import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';
import { DealStatus } from '../@types/enums';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.deals)
  creator: User;

  @Column({ enum: DealStatus })
  status: DealStatus;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor(partial: Partial<Deal>) {
    Object.assign(this, partial);
  }
}
