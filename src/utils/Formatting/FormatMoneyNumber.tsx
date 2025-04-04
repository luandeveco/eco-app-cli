/**
 * Formata uma string contendo valores monetários, substituindo “R$” por “RS”.
 * @param {string} name - String contendo valores monetários.
 * @returns {string} A string formatada com "R$" substituída por "RS".
 */
export function formatMoneyNumber(name: string = ''): string {
  // Split the input string into an array of words
  const nameArray = name.split(' ');

  // Remove currency symbols from each word in the array
  function removeCurrencySymbol(text: string): string {
    return text.normalize("NFD").replace("R$", "RS");
  }

  // Apply the currency symbol removal function to each element of the array
  const arrayWithoutSymbols = nameArray.map(removeCurrencySymbol);

  // Join the formatted array back into a string
  let formattedString = arrayWithoutSymbols.join(' ');

  // Call the lineBreak function to add line breaks if "RS" is present
  let formatted = lineBreak(formattedString, "RS");

  return formatted;
}

/**
 * Formata uma string contendo valores monetários, substituindo "R$" por "RS" e
 * adicionando uma quebra de linha antes de "RS", se presente.
 * @param {string} number - String contendo valores monetários.
 * @returns {string} A string formatada com "R$" substituída por "RS" e quebra de linha adicionada antes de "RS", se presente.
 */
export function formatMoney(number: string): string {
  // Split the input string into an array of words
  const moneyArray = number.split(' ');

  // Remove currency symbols from each word in the array
  function removeCurrencySymbol(text: string): string {
    return text.normalize("NFD").replace("R$", "RS");
  }

  // Apply the currency symbol removal function to each element of the array
  const arrayWithoutSymbols = moneyArray.map(removeCurrencySymbol);

  // Join the formatted array back into a string
  let formattedString = arrayWithoutSymbols.join(' ');

  // Call the lineBreak function to add line breaks if "RS" is present
  let formatted = lineBreak(formattedString, "RS");

  return formatted;
}

/**
 * Adds a line break before "RS" if present in a string containing formatted monetary values.
 * @param {string} text - String containing formatted monetary values.
 * @param {string} keyword - Keyword to be identified for adding a line break.
 * @returns {string} The formatted string with a line break added before "RS" if present.
 */
function lineBreak(text: string, keyword: string): string {
  // Find the position of the keyword in the string
  const keywordIndex = text.toUpperCase().indexOf(keyword.toUpperCase());

  // Insert a line break before the keyword if it's present
  if (keywordIndex !== -1) {
    const beforeKeyword = text.slice(0, keywordIndex);
    const afterKeyword = text.slice(keywordIndex);

    // Combine the text before the keyword, a line break, and the text after the keyword
    const textWithLineBreak = `${beforeKeyword}\n${afterKeyword}`;

    return textWithLineBreak;
  }

  return text;
}
