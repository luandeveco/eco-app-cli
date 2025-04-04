import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'TypePayment' })
export class TypePayment extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column('text', { nullable: true })
  sigla: string;
}
