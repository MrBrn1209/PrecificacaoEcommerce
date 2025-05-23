/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param valor - Valor a ser formatado
 * @returns String formatada (ex: R$ 10,50)
 */
export function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}
