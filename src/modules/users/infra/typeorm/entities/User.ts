import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Role from './Role';
import Course from './Course';
import Bond from './Bond';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  cpf: string;

  @Column()
  phone?: string;

  @Column()
  password?: string;

  @Column()
  roleId: string;

  @Column()
  bondId: string;

  @OneToOne(() => Role)
  @JoinColumn()
  role: Role;

  @OneToOne(() => Bond)
  @JoinColumn()
  bond: Bond;

  @ManyToMany(() => Course)
  @JoinTable({
    name: 'user_courses',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'courseId',
      referencedColumnName: 'id',
    },
  })
  courses?: Course[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
