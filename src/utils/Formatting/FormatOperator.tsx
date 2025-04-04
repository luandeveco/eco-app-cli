/**
 * Formata um nome de operador removendo acentos e limitando o comprimento a 20 caracteres.
 * @param {string} name - O nome do operador a ser formatado.
 * @returns {string} O nome do operador formatado.
 */
export function formatOperator(name: string = ''): string {
  // Split the name into an array of words
  const nameArray = name.split(' ');

  // Utility function to remove accents using regex
  function removeAccentsWithRegex(text: string): string {
      // Normalize the text and remove diacritics
      return text.normalize("NFD").replace(/[\u0300-\u036f]|/g, "").replace(/ª|º/g, ".");
  }

  // Apply the removeAccentsWithRegex function to each element of the array
  const arrayWithoutAccents = nameArray.map(removeAccentsWithRegex);

  // Join the formatted array back into a string
  const formattedString = arrayWithoutAccents.join(' ');

  // Ensure that the result does not exceed 20 characters
  return formattedString.substring(0, 20);
}
