import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'SuburbMovement' })
export class SuburbMovement extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  descricaoCounties: string;

  @Column('text', { nullable: true })
  descricao: string;
}
