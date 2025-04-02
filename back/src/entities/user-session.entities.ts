import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entities';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user_id: User;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  used_at: Date;

  constructor(partial: Partial<UserSession>) {
    Object.assign(this, partial);
  }
}
