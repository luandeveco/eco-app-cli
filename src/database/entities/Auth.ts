import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: "Auth" })
export class Auth extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  access_token: string;

  @Column('text', { nullable: true })
  expires_in: Date;
}
