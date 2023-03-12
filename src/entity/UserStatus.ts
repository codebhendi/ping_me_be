import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
import { User } from './User';

export enum CurrentStatus {
  CALL = 'call',
  INSTAGRAM = 'instagram',
  WHATSAPP = 'whatsapp',
  TEXT = 'text',
  STAR = 'star',
}

@Entity()
export class UserStatus {
  @Column({
    type: 'enum',
    enum: CurrentStatus,
    default: null,
  })
  current_status: CurrentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  udpated_at: Date;

  @OneToOne(() => User, user => user.id)
  @PrimaryColumn()
  user_id: string;
}
