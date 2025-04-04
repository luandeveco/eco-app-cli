import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'BankAccount'})
export class BankAccount extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: number;

  @Column('text', { nullable: true })
  cod_banco: number;

  @Column('text', { nullable: true })
  banco: string;

  @Column('text', { nullable: true })
  agencia: string;

  @Column('text', { nullable: true })
  android: number;
}
