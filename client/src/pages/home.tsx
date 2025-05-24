import CalculadoraForm from "@/components/calculadora-form";
import ResultadoCalculo from "@/components/resultado-calculo";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type DadosProduto = {
  nome: string;
  marca: string;
  referencia: string;
  custoCompra: number;
  precoVenda: number;
};

export type ResultadoCalculos = {
  impostos: number;
  taxasShopee: number;
  custoMaterial: number;
  custoAds: number;
  totalCustos: number;
  lucroLiquido: number;
  margemLucro: number;
};

const Home = () => {
  const [produto, setProduto] = useState<DadosProduto | null>(null);
  const [calculos, setCalculos] = useState<ResultadoCalculos | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Hook para salvar produto no localStorage (armazenamento local do navegador)
  const saveMutation = useMutation({
    mutationFn: (produtoData: DadosProduto) => {
      try {
        // Importação sob demanda para evitar problemas de SSR
        const { inventarioService } = require("@/lib/localStorageService");
        // Salva diretamente no localStorage
        return inventarioService.salvarProduto(produtoData);
      } catch (error) {
        console.error("Erro ao salvar no armazenamento local:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["/api/produtos"]});
      toast({
        title: "Produto salvo!",
        description: "O produto foi adicionado ao seu inventário com sucesso."
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o produto no inventário. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleCalcular = (dadosProduto: DadosProduto) => {
    setProduto(dadosProduto);
    
    // Constantes de custos fixos
    const CUSTO_MATERIAL = 0.30;
    const CUSTO_ADS = 1.00;
    const TAXA_IMPOSTO = 0.10; // 10%
    const TAXA_SHOPEE_PERCENTUAL = 0.20; // 20%
    const TAXA_SHOPEE_FIXA = 4.00; // R$ 4,00
    
    // Cálculos
    const impostos = dadosProduto.precoVenda * TAXA_IMPOSTO;
    const taxasShopee = (dadosProduto.precoVenda * TAXA_SHOPEE_PERCENTUAL) + TAXA_SHOPEE_FIXA;
    const totalCustos = dadosProduto.custoCompra + impostos + taxasShopee + CUSTO_MATERIAL + CUSTO_ADS;
    const lucroLiquido = dadosProduto.precoVenda - totalCustos;
    const margemLucro = (lucroLiquido / dadosProduto.precoVenda) * 100;
    
    const resultadoCalculos: ResultadoCalculos = {
      impostos,
      taxasShopee,
      custoMaterial: CUSTO_MATERIAL,
      custoAds: CUSTO_ADS,
      totalCustos,
      lucroLiquido,
      margemLucro
    };
    
    setCalculos(resultadoCalculos);
    setMostrarResultado(true);
  };

  const handleSalvar = () => {
    if (produto) {
      saveMutation.mutate(produto);
    }
  };

  const handleLimpar = () => {
    setProduto(null);
    setCalculos(null);
    setMostrarResultado(false);
  };
  
  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <header className="w-full max-w-3xl my-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Calculadora de Custos e Precificação</h1>
        <p className="text-[#ACACAC] mt-2">Para vendedores da Shopee Brasil</p>
      </header>
      
      <main className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
        <CalculadoraForm 
          onCalcular={handleCalcular} 
          onLimpar={handleLimpar} 
        />
        
        {mostrarResultado && produto && calculos && (
          <div>
            <ResultadoCalculo 
              produto={produto} 
              calculos={calculos} 
            />
            
            <div className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-center border-t border-gray-200">
              <Button 
                onClick={handleSalvar}
                className="bg-primary hover:bg-[#FF6D40] flex-1"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? "Salvando..." : "Salvar no Inventário"}
              </Button>
              
              <Link href="/inventario">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-[#FFF0ED] flex-1 w-full sm:w-auto"
                >
                  Ver Inventário
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      
      <footer className="w-full max-w-3xl mt-6 mb-10 text-center text-sm text-[#ACACAC]">
        <p>Esta calculadora foi desenvolvida para auxiliar vendedores da Shopee Brasil.</p>
        <p>Os valores são aproximados e podem variar de acordo com políticas específicas da plataforma.</p>
        <Link href="/inventario" className="text-primary hover:underline inline-block mt-2">
          Acessar o Inventário de Produtos
        </Link>
      </footer>
    </div>
  );
};

export default Home;
