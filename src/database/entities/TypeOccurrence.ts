import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'TypeOccurrence' })
export class TypeOccurrence extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: string;

  @Column('text', { nullable: true })
  descricao: string;

  @Column('text', { nullable: true })
  Ativo: string;

  @Column('text', { nullable: true })
  TypeOccurrenceId: string;
}
