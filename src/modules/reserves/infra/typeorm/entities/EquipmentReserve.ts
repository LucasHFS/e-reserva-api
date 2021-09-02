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
import Equipment from '@modules/rentable-items/infra/typeorm/entities/Equipment';

@Entity('equipment_reserve')
class EquipmentReserve {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column()
  equipment_id: string;

  @ManyToOne(() => Equipment)
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  starts_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default EquipmentReserve;
