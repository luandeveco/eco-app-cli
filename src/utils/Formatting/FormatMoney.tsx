/**
 * Formata uma string que representa dinheiro removendo símbolos de moeda e truncando após o símbolo de moeda "RS".
 * @param {string} number - A string que representa dinheiro com símbolos de moeda opcionais.
 * @returns {string} A string de dinheiro formatada com o símbolo monetário "RS" e truncada depois dele.
 */
export function formatMoney(number: string) {
  // Split the input string by spaces to handle multiple currencies
  const moneyArray = number.split(' ');

  // Utility function to remove currency symbols
  function removeCurrencySymbol(text: string) {
    // Normalize the text to decomposed form and replace "R$" with "RS"
    return text.normalize("NFD").replace("R$", "RS");
  }

  // Remove currency symbols from each element in the array
  const arrayWithoutSymbols = moneyArray.map(removeCurrencySymbol);

  // Join the formatted array back into a string
  let formattedString = arrayWithoutSymbols.join(' ');

  // Call the truncateAfterRS function to remove everything after "RS"
  formattedString = truncateAfterRS(formattedString);
  return formattedString;
}

/**
 * Trunca uma string após a ocorrência do símbolo monetário "RS".
 * @param {string} text - O texto no qual truncar após "RS".
 * @returns {string} O texto truncado até "RS" inclusive, ou o texto original se "RS" não for encontrado.
 */
function truncateAfterRS(text: string): string {
  // Find the position of the currency symbol "RS" in the string
  const keywordIndex = text.toUpperCase().indexOf("RS");

  // Remove everything after "RS", including "RS" itself
  if (keywordIndex !== -1) {
    return text.slice(0, keywordIndex + 2).trim();
  }

  return text;
}
