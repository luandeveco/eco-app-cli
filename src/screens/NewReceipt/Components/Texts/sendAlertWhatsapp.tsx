import {formatName} from '../../../../utils/Formatting/FormatName';

export function sendText(NumberReceipt: number, name: string, company: string, cnpj: string, phone1: string | null, phone2: string | null, phone3: string | null) {
  return (
    'PASSAMOS POR AQUI\n\n\nRECIBO: ' +
    NumberReceipt +
    `\n\n\n*${company}*\n*CNPJ:* ${cnpj}\n*TEL:* ${phone1}` + ' ' +
    (phone2 ? `${phone2}` : '') +
    (phone3 ? `${phone3}` : '') +
    `\n\n\nOlá, ` +
    formatName(name) +
    '\nNosso mensageiro hoje veio coletar sua doação, mas não conseguimos encontra-lo(a).\n\nNosso mensageiro deve retornar em outro momento\n\n\nCentral de Doações\n\n'
  );
}
