import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'Shift'})
export class Shift extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  HoraAberturaSistema: string;

  @Column('text', { nullable: true })
  HoraFechamentoSistema: string;
}
