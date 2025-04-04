/**
 * Formata uma sequência de número de telefone no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.
 * @param {string} number - A sequência do número de telefone a ser formatada.
 * @returns {string} A string do número de telefone formatada.
 */
export function formatPhoneNumber(number: string): string {
  // Remove all non-numeric characters from the input string
  const cleaned = ('' + number).replace(/\D/g, '');

  // Check if the cleaned string matches the phone number format
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);

  // If the match is found, format the phone number
  if (match) {
      // Construct the formatted phone number string with parentheses, space, and hyphen
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  // If the input number does not match the phone number format, return the original number
  return number;
}
