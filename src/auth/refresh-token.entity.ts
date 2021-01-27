import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['id'])
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userId: number
  @Column()
  isRevoked: boolean;
  @Column()
  expires: Date
}