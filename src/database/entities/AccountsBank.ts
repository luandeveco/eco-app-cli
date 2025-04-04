import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: "AccountsBank" })
export class AccountsBank extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  label: string;

  @Column('text', { nullable: true })
  value: string;
}