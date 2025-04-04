import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'Suburb' })
export class Suburb extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column('text', { nullable: true })
  cod_mensageiro: string;

  @Column('text', { nullable: true })
  cod_municipio: string;
}
