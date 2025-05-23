import CalculadoraForm from "@/components/calculadora-form";
import ResultadoCalculo from "@/components/resultado-calculo";
import { useState } from "react";

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
          <ResultadoCalculo 
            produto={produto} 
            calculos={calculos} 
          />
        )}
      </main>
      
      <footer className="w-full max-w-3xl mt-6 mb-10 text-center text-sm text-[#ACACAC]">
        <p>Esta calculadora foi desenvolvida para auxiliar vendedores da Shopee Brasil.</p>
        <p>Os valores são aproximados e podem variar de acordo com políticas específicas da plataforma.</p>
      </footer>
    </div>
  );
};

export default Home;
