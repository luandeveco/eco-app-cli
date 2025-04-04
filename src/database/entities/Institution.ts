import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'Institution'})
export class Institution extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  mensagem_boleto: string;

  @Column('text', { nullable: true })
  telefone_finalizar_android1: string;

  @Column('text', { nullable: true })
  telefone_finalizar_android2: string;
}
