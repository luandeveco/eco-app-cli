import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'Routes'})
export class Routes extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  status: number;

  @Column('int', { nullable: true })
  city: number;

  @Column('int', { nullable: true })
  neighborhoods: number; //Bairro

  @Column('int', { nullable: true })
  StatusCity: number;

  @Column('int', { nullable: true })
  StatusCityNeighborhoods: number;

  @Column('int', { nullable: true })
  ordem: number;

  @Column('int', { nullable: true })
  receipt: number;
}
