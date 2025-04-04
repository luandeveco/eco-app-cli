import {formatAssociation} from '../../../../utils/Formatting/FormatAssociation';
import { formatCNPJ } from '../../../../utils/Formatting/FormatCNPJ';
import {formatName} from '../../../../utils/Formatting/FormatName';
import { formatOperator } from '../../../../utils/Formatting/FormatOperator';

export async function printReceipt(
  cnpj: string,
  Institution: string,
  Phone1: string,
  Phone2: string,
  Phone3: string,
  Receipt: string,
  name: string,
  valuePaidSelected: string,
  messengerName: string,
  dateLastContributions: string,
  dateDonation: string,
  operator: string,
  DateToday: string,
  cod: string,
) {
  return (
    `CNPJ: ${formatCNPJ(cnpj)}\n` +
    formatAssociation(Institution) +
    (Phone1 ? `\nTel.:${Phone1}`: '') +
    (Phone2 ? `\nTel.:${Phone2}` : '') +
    (Phone3 ? `\nTel.:${Phone3}` : '') +
    '\n\n---------Dados do doador--------\n' +
    'Codigo do doador: ' + cod +
    '\nNome: ' + formatName(name) +
    '\nO valor de RS: ' + valuePaidSelected.replace('.',',') +
    '\n---------Dados da doacao--------\n' +
    'RECIBO: ' + Receipt +
    '\nMENSAGEIRO: ' +
    messengerName +
    '\nDATA ULT. DOACAO: ' +
    dateLastContributions +
    '\nOPERADOR: ' +
    formatOperator(operator) +
    '\nDATA DOACAO: ' +
    DateToday +
    '\n\n------------Mensagem------------\n' +
    'AS DOACOES EFETUADAS A ENTIDADESFILANTROPICAS NAO SAO DEDUTIVEIS, POR FALTA DE PREVISAO LEGAL.\n' +
    '   Colaborar Transforma vidas\n' +
    '       Muito obrigado!!!'
  );
}
