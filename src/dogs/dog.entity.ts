import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../auth/user.entity";

@Entity()
export class Dog extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  city: string;

  @Column()
  area: string;

  @ManyToOne(type => User, user => user.dogs, { eager: false })
  owner: User;

  @Column()
  userId: number;

}
