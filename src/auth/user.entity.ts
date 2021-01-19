import { Column, Entity, OneToMany, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Dog } from "../dogs/dog.entity";
import { DogsterBaseModel } from "../Entities/BaseModel";

@Entity()
@Unique(['username'])
export class User extends DogsterBaseModel {
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  salt: string;

  @OneToMany(() => Dog, dog => dog.owner, { eager: true })
  dogs: Dog[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password;
  }
}