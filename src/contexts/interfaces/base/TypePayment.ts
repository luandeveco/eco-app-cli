export interface TypePayment {
  codigo: string;
  descricao: string;
  ATIVO: boolean;
  IMPRIME_RECIBO: boolean;
  ENTRA_MOVIMENTO_DIARIO: boolean;
  ORDEM_DISPLAY: number;
  PERMITE_AGRUPAR: boolean;
  SIGLA: string;
  COD_MENSAGEIRO_PADRAO: string;
  ENTRA_CALENDARIO_INTERIOR: boolean;
  FiltroRecebido: string;
  FiltroDevolucao: string;
  operador: string;
}
