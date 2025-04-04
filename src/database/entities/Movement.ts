import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({name: 'Movement'})
export class Movement extends BaseEntity{
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  numero_recibo: string;

  @Column('varchar', { nullable: true })
  cod_contribuinte: string;

  @Column('text', { nullable: true })
  nome_contribuinte: string;

  @Column('text', { nullable: true })
  end_logradouro: string;

  @Column('text', { nullable: true })
  end_numero: string;

  @Column('text', { nullable: true })
  end_complemento: string;

  @Column('text', { nullable: true })
  end_referencia: string;

  @Column('text', { nullable: true })
  end_municipio: string;

  @Column('text', { nullable: true })
  end_bairro: string;

  @Column('text', { nullable: true })
  telefone1: string;

  @Column('text', { nullable: true })
  telefone2: string;

  @Column('text', { nullable: true })
  telefone3: string;

  @Column('text', { nullable: true })
  memo_obs_mensageiro: string;

  @Column('decimal', { nullable: true })
  valor_prev: number;

  @Column('decimal', { nullable: true })
  valor_pago: number;

  @Column('int', { nullable: true })
  cod_ultima_ocorrencia: number;

  @Column('int', { nullable: true })
  cod_banco_baixa: string;

  @Column('text', { nullable: true })
  turno: string;

  @Column('int', { nullable: true })
  status: number;

  @Column('text', { nullable: true })
  operador: string;

  @Column('int', { nullable: true })
  cod_tipo_pagamento: number;

  @Column('int', { nullable: true })
  ordem: number;

  @Column('date', { nullable: true })
  data_prev: Date;

  @Column('date', { nullable: true })
  data_ultima_contribuicoes: Date;

  @Column('int', { nullable: true })
  saldos: number;

  @Column('boolean', { nullable: true })
  doador_novo: boolean;

  @Column('text', { nullable: true })
  texto_obs: string;

  @Column('varchar', { nullable: true })
  usuario_baixa: string;

  @Column('date', { nullable: true })
  ultima_visita: string;

  @Column('varchar', { nullable: true })
  latitude: string;

  @Column('varchar', { nullable: true })
  longitude: string;

  @Column('text', { nullable: true })
  endereco_cobranca: string;

  @Column('text', { nullable: true })
  distancia: string;

  @Column('text', { nullable: true })
  data_baixa: string;

  @Column('text', { nullable: true })
  obs_contribuinte: string;
  
  @Column('text', { nullable: true })
  TelefoneObs: string;

  @Column('nvarchar', { nullable: true })
  CPF: string | number;

  @Column('nvarchar', { nullable: true })
  CNPJ: string | number;

  @Column('tinyint', { nullable: true })
  TipoPessoa: string | number;

  @Column('int', { nullable: true })
  devolutivaMen: number;

  @Column('int', { nullable: true })
  obsMen: number;
}
