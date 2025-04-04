import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';

@Entity({name: 'InstitutionInformation'})
export class InstitutionInformation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', {nullable: true})
  cnpj: string;

  @Column('text', {nullable: true})
  RazaoSocial: string;

  @Column('text', {nullable: true})
  NomeFantasia: string;

  @Column('text', {nullable: true})
  Sigla: string;

  @Column('text', {nullable: true})
  Email: string;

  @Column('text', {nullable: true})
  Telefone1: string;

  @Column('text', {nullable: true})
  Telefone2: string;

  @Column('text', {nullable: true})
  Telefone3: string;

  @Column('text', {nullable: true})
  EnderecoCEP: string;

  @Column('text', {nullable: true})
  EnderecoNumero: string;

  @Column('text', {nullable: true})
  EnderecoComplemento: string;

  @Column('text', {nullable: true})
  AlterarTelefone: string;

  @Column('text', {nullable: true})
  NumeroSuporte: string;
}
