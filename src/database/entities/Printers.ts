import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'Printer'})
export class Printer extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  inner_mac_address: string;

  @Column('text', { nullable: true })
  nome: string;

  @Column('text', { nullable: true })
  impressoraPadrao: string;
}
