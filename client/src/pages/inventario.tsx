import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { formatarMoeda } from "@/lib/formatacao";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";
import type { DadosProduto } from "./home";
import { Link } from "wouter";
import { inventarioService, ProdutoSalvo } from "@/lib/localStorageService";

const Inventario = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estado para armazenar produtos do localStorage
  const [produtos, setProdutos] = useState<ProdutoSalvo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Carrega produtos do localStorage quando o componente monta
  useEffect(() => {
    const carregarProdutos = () => {
      try {
        const produtosSalvos = inventarioService.obterProdutos();
        setProdutos(produtosSalvos);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar seus produtos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarProdutos();
  }, [toast]);
  
  // Mutation para excluir produto do localStorage
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const sucesso = inventarioService.excluirProduto(id);
      if (!sucesso) throw new Error("Produto não encontrado");
      return id;
    },
    onSuccess: (id) => {
      // Atualiza o estado local em vez de fazer nova requisição
      setProdutos(produtos.filter(p => p.id !== id));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi removido do inventário com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive"
      });
    }
  });
  
  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteMutation.mutate(id);
    }
  };
  
  // Calcular lucro e margem
  const calcularResultados = (produto: ProdutoSalvo) => {
    const custoCompra = typeof produto.custoCompra === 'string' 
      ? parseFloat(produto.custoCompra) 
      : produto.custoCompra;
      
    const precoVenda = typeof produto.precoVenda === 'string' 
      ? parseFloat(produto.precoVenda) 
      : produto.precoVenda;
    
    const impostos = precoVenda * 0.10;
    const taxasShopee = (precoVenda * 0.20) + 4;
    const custoMaterial = 0.30;
    const custoAds = 1.00;
    const totalCustos = custoCompra + impostos + taxasShopee + custoMaterial + custoAds;
    const lucroLiquido = precoVenda - totalCustos;
    const margemLucro = (lucroLiquido / precoVenda) * 100;
    
    return {
      lucroLiquido,
      margemLucro
    };
  };
  
  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <header className="w-full max-w-4xl my-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Inventário de Produtos</h1>
        <p className="text-[#ACACAC] mt-2">Gerencie seus produtos cadastrados na Shopee</p>
      </header>
      
      <main className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              Voltar para Calculadora
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Carregando produtos...</p>
          </div>
        ) : produtos && produtos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {produtos.map((produto) => {
              const { lucroLiquido, margemLucro } = calcularResultados(produto);
              
              return (
                <Card key={produto.id} className="shadow-sm">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <CardTitle className="text-lg font-medium">{produto.nome}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(produto.id)}
                    >
                      <Trash size={18} />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Marca:</span>
                        <span>{produto.marca}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Referência:</span>
                        <span>{produto.referencia}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Custo:</span>
                        <span>{formatarMoeda(Number(produto.custoCompra))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#ACACAC]">Preço:</span>
                        <span>{formatarMoeda(Number(produto.precoVenda))}</span>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Lucro Líquido:</span>
                          <span className={`font-bold ${lucroLiquido < 0 ? 'text-red-500' : 'text-[#28A745]'}`}>
                            {formatarMoeda(lucroLiquido)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#ACACAC] text-xs">Margem:</span>
                          <span className={`text-xs ${margemLucro < 0 ? 'text-red-500' : 'text-[#28A745]'}`}>
                            {margemLucro.toFixed(2).replace('.', ',')}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-md">
            <p className="text-lg text-[#ACACAC]">Nenhum produto cadastrado no inventário</p>
            <p className="mt-2">Use a calculadora para adicionar novos produtos</p>
            <Link href="/">
              <Button className="mt-4">Ir para Calculadora</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventario;