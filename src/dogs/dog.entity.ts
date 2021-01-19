import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "../auth/user.entity";
import { DogsterBaseModel } from "../Entities/BaseModel";

@Entity()
export class Dog extends DogsterBaseModel {

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  city: string;

  @Column()
  area: string;

  @ManyToOne(() => User, user => user.dogs, { eager: false })
  owner: User;

  @Column()
  userId: number;

}
