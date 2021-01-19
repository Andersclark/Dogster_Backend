import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate, Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { v4 as uuid } from 'uuid';

export abstract class DogsterBaseModel extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid'})
  uuid: string;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @BeforeInsert()
  createUuid() {
    this.uuid = uuid();
  }
  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }
  toJSON(){
    return  { ...this, id: undefined }
  }
}