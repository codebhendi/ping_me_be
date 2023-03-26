import {
  Column,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserData } from './UserData';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserData)
  @PrimaryColumn()
  @JoinColumn({ referencedColumnName: 'id', name: 'user_data_id' })
  user_id: string;

  @Column()
  otp_value: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
