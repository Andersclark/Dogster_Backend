import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity()
@Unique(['id'])
export class RefreshToken extends BaseEntity {
  @PrimaryColumn()
  id: string;
  @Column()
  userId: string;
  @Column()
  isRevoked: boolean;
  @Column()
  expires: Date;
}
