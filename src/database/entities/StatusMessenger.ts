import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'StatusMessenger'})
export class StatusMessenger extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  codigo: string;

  @Column('text', { nullable: true })
  descricao: string;
}
