/**
 * Formata uma determinada string de nome cortando os espaços em branco, colocando a primeira letra de cada palavra em maiúscula,
 * e removendo quaisquer espaços iniciais ou finais.
 * @param {string} name - A string de nome a ser formatada.
 * @returns {string} A string de nome formatada.
 */
export function formatName(name: string = ''): string {
  // Trim any leading or trailing whitespace
  const trimmedName = name.trim();

  // Split the trimmed name into an array of lowercase words, removing any empty elements
  const namesArray = trimmedName.toLocaleLowerCase().split(' ').filter(Boolean);

  // Capitalize the first letter of each word
  const formattedNamesArray = namesArray.map((name) => {
      return name.charAt(0).toUpperCase() + name.slice(1);
  });

  // Join the formatted array back into a string
  const formattedName = formattedNamesArray.join(' ');

  // Calculate the character count of the formatted name
  const characterCount = formattedName.length;

  // Return the formatted name string truncated to the character count
  return formattedName.substring(0, characterCount);
}
