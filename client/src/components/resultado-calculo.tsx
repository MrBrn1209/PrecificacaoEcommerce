import { DadosProduto, ResultadoCalculos } from "@/pages/home";
import { formatarMoeda } from "@/lib/formatacao";

interface ResultadoCalculoProps {
  produto: DadosProduto;
  calculos: ResultadoCalculos;
}

const ResultadoCalculo = ({ produto, calculos }: ResultadoCalculoProps) => {
  return (
    <div className="border-t border-gray-200 bg-[#F5F5F5] p-6">
      <h2 className="text-xl font-semibold mb-4">Resultado do Cálculo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coluna de Detalhes */}
        <div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-3">Detalhes do Produto</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Nome:</span>
                <span>{produto.nome || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Marca:</span>
                <span>{produto.marca || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Referência:</span>
                <span>{produto.referencia || "-"}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-lg mb-3">Valores</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#ACACAC]">Custo da Compra:</span>
                  <span>{formatarMoeda(produto.custoCompra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#ACACAC]">Preço de Venda:</span>
                  <span>{formatarMoeda(produto.precoVenda)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coluna de Custos */}
        <div>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-medium text-lg mb-3">Custos e Taxas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Impostos (10%):</span>
                <span>{formatarMoeda(calculos.impostos)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Taxas Shopee (20% + R$4):</span>
                <span>{formatarMoeda(calculos.taxasShopee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Custo de Material:</span>
                <span>{formatarMoeda(calculos.custoMaterial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#ACACAC]">Custo de Anúncios:</span>
                <span>{formatarMoeda(calculos.custoAds)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                <span className="text-[#ACACAC]">Total de Custos:</span>
                <span>{formatarMoeda(calculos.totalCustos)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#FFF0ED] p-5 rounded-lg shadow-sm mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-primary">Lucro Líquido</h3>
                <p className="text-sm text-[#ACACAC]">Após todos os custos e taxas</p>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${calculos.lucroLiquido < 0 ? 'text-red-500' : 'text-[#28A745]'}`}>
                  {formatarMoeda(calculos.lucroLiquido)}
                </div>
                <div className="text-sm font-medium">
                  {calculos.margemLucro.toFixed(2).replace('.', ',')}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultadoCalculo;
