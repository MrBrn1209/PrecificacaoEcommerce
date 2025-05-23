export type ProdutoAPI = {
  id: number;
  nome: string;
  marca: string;
  referencia: string;
  custoCompra: string; // Dados vêm como string do banco
  precoVenda: string; // Dados vêm como string do banco
  dataCadastro: string;
};