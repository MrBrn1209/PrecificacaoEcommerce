import { DadosProduto } from "@/pages/home";

const STORAGE_KEY = 'shopee-produtos';

export type ProdutoSalvo = DadosProduto & {
  id: number;
  dataCadastro: string;
};

export const inventarioService = {
  salvarProduto: (produto: DadosProduto): ProdutoSalvo => {
    const produtos = inventarioService.obterProdutos();
    
    // Gera um ID único
    const id = produtos.length > 0 
      ? Math.max(...produtos.map(p => p.id)) + 1 
      : 1;
    
    const novoProduto: ProdutoSalvo = {
      ...produto,
      id,
      dataCadastro: new Date().toISOString()
    };
    
    produtos.push(novoProduto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    
    return novoProduto;
  },
  
  obterProdutos: (): ProdutoSalvo[] => {
    const dadosArmazenados = localStorage.getItem(STORAGE_KEY);
    return dadosArmazenados ? JSON.parse(dadosArmazenados) : [];
  },
  
  excluirProduto: (id: number): boolean => {
    const produtos = inventarioService.obterProdutos();
    const produtosFiltrados = produtos.filter(p => p.id !== id);
    
    if (produtosFiltrados.length < produtos.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtosFiltrados));
      return true;
    }
    
    return false;
  }
};