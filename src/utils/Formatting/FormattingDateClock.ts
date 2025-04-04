/**
 * Formata uma data e hora de acordo com o formato especificado.
 * @param {Date | string} datetime - O objeto Date ou uma string representando uma data no formato "AAAA-MM-DDTHH:MM:SS".
 * @param {string} format - O formato desejado para a data e hora (padrão é "dd/mm/yyyy HH:MM").
 * @returns {string} A data e hora formatadas de acordo com o formato especificado.
 */
export function formatDateTime(datetime: Date | string, format: string = "dd/mm/yyyy HH:MM"): string {
  // Verifica se 'datetime' é uma instância de Date
  if (!(datetime instanceof Date)) {
    // Se não for uma instância de Date, cria um novo objeto Date a partir da string fornecida
    datetime = new Date(datetime);
  }

  // Obtém o dia, mês, ano, horas, minutos e segundos da data
  const year = datetime.getFullYear(); // Obtém o ano com quatro dígitos
  const month = String(datetime.getMonth() + 1).padStart(2, '0'); // Obtém o mês com zero à esquerda, se necessário
  const day = String(datetime.getDate()).padStart(2, '0'); // Obtém o dia com zero à esquerda, se necessário
  const hours = String(datetime.getHours()).padStart(2, '0'); // Obtém as horas com zero à esquerda, se necessário
  const minutes = String(datetime.getMinutes()).padStart(2, '0'); // Obtém os minutos com zero à esquerda, se necessário

  // Substitui os marcadores de posição no formato da data pelos valores reais
  let result = format.replace('dd', day); // Substitui 'dd' pelo dia
  result = result.replace('mm', month); // Substitui 'mm' pelo mês
  result = result.replace('yyyy', String(year)); // Substitui 'yyyy' pelo ano
  result = result.replace('HH', hours); // Substitui 'HH' pelas horas
  result = result.replace('MM', minutes); // Substitui 'MM' pelos minutos

  // Retorna a data e hora formatadas
  return result;
}
