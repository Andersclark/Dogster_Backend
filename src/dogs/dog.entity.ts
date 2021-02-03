import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Dog extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  city: string;

  @Column()
  area: string;

  @ManyToOne(type => User, user => user.dogs)
  owner: User;
}
