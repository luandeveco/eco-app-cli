/**
 * Formata uma string de CNPJ.
 * @param cnpj - A string do CNPJ que será formatada.
 * @returns A string do CNPJ formatada no padrão "XX.XXX.XXX/XXXX-XX".
 */
export function formatCNPJ(cnpj: string): string {
  // Remove qualquer caractere que não seja número
  cnpj = cnpj.replace(/\D/g, '');

  // Verifica se a string possui 14 dígitos
  if (cnpj.length !== 14) {
      return cnpj;
  }

  // Formata a string no padrão "XX.XXX.XXX/XXXX-XX"
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
