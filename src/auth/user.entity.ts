import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Dog } from "../dogs/dog.entity";

@Entity()
@Unique(['username', 'id'])
export class User extends BaseEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  salt: string;

  @OneToMany(type => Dog, dog => dog.owner, { eager: true })
  dogs: Dog[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password;
  }
}