/**
 * Formata um número de CPF brasileiro inserindo pontos e hífens nos locais corretos.
 * @param {string} number - O número do CPF a ser formatado.
 * @returns {string} O número do CPF formatado com pontos e hifens, se o número estiver no formato correto. Caso contrário, retorna o número original.
 */
export default function formatCPF(number: string) {
  // Remove all non-numeric characters from the input string
  const cleaned = ('' + number).replace(/\D/g, '');

  // Check if the cleaned string matches the CPF format (11 digits)
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

  // If the match is found, format the CPF number
  if (match) {
    // Construct the formatted CPF number with dots and hyphens
    return match[1] + '.' + match[2] + '.' + match[3] + '-' + match[4];
  }

  // If the input number does not match the CPF format, return the original number
  return number;
}
