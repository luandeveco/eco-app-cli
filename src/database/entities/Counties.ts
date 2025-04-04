import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'Counties' })
export class Counties extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column('text', { nullable: true })
  cod_uf: string;

  @Column('text', { nullable: true })
  municipio_padrao: string;

  @Column('text', { nullable: true })
  interior: string;
}
