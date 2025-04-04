import { formatAssociation } from "../../../../utils/Formatting/FormatAssociation";
import { formatName } from "../../../../utils/Formatting/FormatName";

export function printNotice(Institution: string, Receipt: number, name: string) {
  return "--------------------------------\n" +
    formatAssociation(Institution) +
    "\n--------------------------------\n" +
    "RECIBO: " + Receipt +
    "\nOla,\n" +
    formatName(name) +
    "\n\nHoje, o mensageiro veio coletar sua doacao, mas hoje nao \nconseguimos encontra-lo(a).\n\nNosso mensageiro deve retornar em outro momento\n\nCentral de Doacoes";
}
