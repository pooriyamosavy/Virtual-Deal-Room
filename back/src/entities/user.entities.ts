import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserSession } from './user-session.entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  fullname: string;

  @Column({
    unique: true,
  })
  @ApiProperty()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => UserSession, (session) => session.user_id)
  @Exclude()
  sessions: UserSession[];

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @Column({ enum: ['Buyer', 'Seller'] })
  @ApiProperty()
  role: 'Buyer' | 'Seller';

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
