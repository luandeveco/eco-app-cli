import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity({name: 'ReceiptSettings'})
export class ReceiptSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', {nullable: true})
  SummaryReceipt: boolean;

  @Column('boolean', {nullable: true})
  AssemblyNew: boolean;

  @Column('boolean', {nullable: true})
  AssemblyOld: boolean;

  @Column('int', {nullable: true})
  sizeFont: number;
}
