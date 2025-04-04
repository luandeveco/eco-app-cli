/**
 * Formata o nome de uma associação removendo acentos e adicionando quebras de linha antes de palavras-chave específicas.
 * @param {string} name - O nome da associação.
 * @returns {string} O nome formatado da associação.
 */

export function formatAssociation(name: string = ''): string {
  // Split into Array
  const nameArray = name.split(' ');
  
  // Remove accents with Regex
  function removeAccentsWithRegex(text: string) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const arrayWithoutAccents = nameArray.map(removeAccentsWithRegex);

  // Join the formatted array back into a string
  let formattedString = arrayWithoutAccents.join(' ');
  // Call the lineBreak function to add line breaks
  formattedString = lineBreak(formattedString, "CNPJ");
  formattedString = lineBreak(formattedString, "Phone");
  return formattedString;
}

/**
 * Insere uma quebra de linha antes de uma palavra-chave especificada em uma determinada sequência de texto.
 * @param {string} text - O texto no qual será inserida a quebra de linha.
 * @param {string} keyword - A palavra-chave antes da qual a quebra de linha será inserida.
 * @returns {string} O texto com uma quebra de linha inserida antes da palavra-chave especificada.
 */

function lineBreak(text: string, keyword: string): string {
  // Find the position of the word in the string
  const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase());

  // Insert a line break before the word if it's present
  if (keywordIndex !== -1) {
    const beforeKeyword = text.slice(0, keywordIndex);
    const afterKeyword = text.slice(keywordIndex);

    // Add bold commands to the text before the keyword and line break
    const textWithBold = `${beforeKeyword}\n${afterKeyword}`;

    return textWithBold;
  }

  return text;
}
