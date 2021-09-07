import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import SportCourt from '@modules/rentable-items/infra/typeorm/entities/SportCourt';

@Entity('sport_court_reserve')
class SportCourtReserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  sport_court_id: string;

  @ManyToOne(() => SportCourt)
  @JoinColumn({ name: 'sport_court_id' })
  sport_court: SportCourt;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  justification?: string;

  @Column('timestamp with time zone')
  starts_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default SportCourtReserve;
