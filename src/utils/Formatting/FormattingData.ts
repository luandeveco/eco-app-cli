/**
 * Formata uma data de acordo com o formato especificado.
 * @param {Date | string} date - O objeto Date ou uma string representando uma data no formato "AAAA-MM-DD".
 * @param {string} format - O formato desejado para a data (padrão é "dd/mm/yyyy").
 * @returns {string} A data formatada de acordo com o formato especificado.
 */
export function formatDate(date: Date | string, format: string = "dd/mm/yyyy"): string {
  // Verifica se 'date' é uma instância de Date
  if (!(date instanceof Date)) {
    // Se não for uma instância de Date, cria um novo objeto Date a partir da string fornecida
    date = new Date(date);
  }

  // Obtém o dia, mês e ano da data
  const year = date.getFullYear(); // Obtém o ano com quatro dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtém o mês com zero à esquerda, se necessário
  const day = String(date.getDate()).padStart(2, '0'); // Obtém o dia com zero à esquerda, se necessário

  // Substitui os marcadores de posição no formato da data pelos valores reais
  let result = format.replace('dd', day); // Substitui 'dd' pelo dia
  result = result.replace('mm', month); // Substitui 'mm' pelo mês
  result = result.replace('yyyy', String(year)); // Substitui 'yyyy' pelo ano

  // Retorna a data formatada
  return result;
}

export function formatDateReceipt(date: Date | string, format: string = "dd/mm/yyyy"): string {
  // Verifica se 'date' é uma instância de Date
  if (!(date instanceof Date)) {
    // Se não for uma instância de Date, cria um novo objeto Date a partir da string fornecida
    date = new Date(date);
  }

  // Obtém o dia, mês e ano da data
  const year = date.getUTCFullYear(); // Obtém o ano com quatro dígitos
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Obtém o mês com zero à esquerda, se necessário
  const day = String(date.getUTCDate()).padStart(2, '0'); // Obtém o dia com zero à esquerda, se necessário

  // Substitui os marcadores de posição no formato da data pelos valores reais
  let result = format.replace('dd', day); // Substitui 'dd' pelo dia
  result = result.replace('mm', month); // Substitui 'mm' pelo mês
  result = result.replace('yyyy', String(year)); // Substitui 'yyyy' pelo ano

  // Retorna a data formatada
  return result;
}

/**
 * Formata a hora de acordo com o formato especificado.
 * @param {Date | string} date - O objeto Date ou uma string representando uma data e hora.
 * @param {string} format - O formato desejado para a hora (padrão é "HH:MM:SS").
 * @returns {string} A hora formatada de acordo com o formato especificado.
 */
export function formatTime(date: Date | string, format: string = "HH:MM:SS"): string {
  // Verifica se 'date' é uma instância de Date
  if (!(date instanceof Date)) {
    // Se não for uma instância de Date, cria um novo objeto Date a partir da string fornecida
    date = new Date(date);
  }

  // Obtém as horas, minutos e segundos da data
  const hours = String(date.getHours()).padStart(2, '0'); // Obtém as horas com zero à esquerda, se necessário
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtém os minutos com zero à esquerda, se necessário
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Obtém os segundos com zero à esquerda, se necessário

  // Substitui os marcadores de posição no formato da hora pelos valores reais
  let result = format.replace('HH', hours); // Substitui 'HH' pelas horas
  result = result.replace('MM', minutes); // Substitui 'MM' pelos minutos
  result = result.replace('SS', seconds); // Substitui 'SS' pelos segundos

  // Retorna a hora formatada
  return result;
}
