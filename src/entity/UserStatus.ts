import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
} from 'typeorm';
import { UserData } from './UserData';

export enum CurrentStatus {
  CALL = 'call',
  INSTAGRAM = 'instagram',
  WHATSAPP = 'whatsapp',
  TEXT = 'text',
  STAR = 'star',
  UNAVAILABLE = 'unavailable',
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

  @OneToOne(() => UserData, user => user.id)
  @PrimaryColumn()
  user_id: string;
}
