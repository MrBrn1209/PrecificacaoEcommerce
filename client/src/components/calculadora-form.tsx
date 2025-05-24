import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { DadosProduto } from "@/pages/home";

interface CalculadoraFormProps {
  onCalcular: (dados: DadosProduto) => void;
  onLimpar: () => void;
}

const formSchema = z.object({
  nome: z.string().min(1, { message: "O nome do produto é obrigatório" }),
  marca: z.string().min(1, { message: "A marca é obrigatória" }),
  referencia: z.string().min(1, { message: "A referência é obrigatória" }),
  custoCompra: z.coerce.number().min(0.01, { message: "O custo deve ser maior que zero" }),
  precoVenda: z.coerce.number().min(0.01, { message: "O preço deve ser maior que zero" })
});

const CalculadoraForm = ({ onCalcular, onLimpar }: CalculadoraFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      marca: "",
      referencia: "",
      custoCompra: 0,
      precoVenda: 0
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onCalcular({
      nome: values.nome,
      marca: values.marca,
      referencia: values.referencia,
      custoCompra: values.custoCompra,
      precoVenda: values.precoVenda
    });
  };

  const handleLimpar = () => {
    form.reset();
    onLimpar();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6">
        <div className="bg-[#FFF0ED] -mx-6 -mt-6 p-6 mb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-primary">Detalhes do Produto</h2>
          <p className="text-sm text-[#ACACAC]">Preencha os campos para calcular o lucro líquido</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Produto */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <FormControl>
                    <Input 
                      id="nome" 
                      placeholder="Ex: Camiseta Estampada" 
                      className="w-full p-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="marca"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="marca">Marca do Produto</Label>
                  <FormControl>
                    <Input 
                      id="marca" 
                      placeholder="Ex: FashionBR" 
                      className="w-full p-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referencia"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="referencia">Referência do Produto</Label>
                  <FormControl>
                    <Input 
                      id="referencia" 
                      placeholder="Ex: CAM-001" 
                      className="w-full p-3" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Valores do Produto */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="custoCompra"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="custoCompra">Custo da Compra (R$)</Label>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ACACAC]">R$</span>
                      <Input 
                        id="custoCompra" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        placeholder="0,00" 
                        className="w-full p-3 pl-10" 
                        {...field}
                        onBlur={(e) => {
                          e.target.value = e.target.value === '' ? '' : Number(e.target.value).toString();
                          field.onBlur();
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="precoVenda"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="precoVenda">Preço de Venda (R$)</Label>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#ACACAC]">R$</span>
                      <Input 
                        id="precoVenda" 
                        type="number" 
                        step="0.01" 
                        min="0"
                        placeholder="0,00" 
                        className="w-full p-3 pl-10" 
                        {...field}
                        onBlur={(e) => {
                          e.target.value = e.target.value === '' ? '' : Number(e.target.value).toString();
                          field.onBlur();
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-6 flex space-x-3">
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-[#FF6D40] text-white py-3 px-6 rounded-lg font-medium transition shadow-sm hover:shadow"
              >
                Calcular
              </Button>
              <Button 
                type="button" 
                variant="secondary"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition"
                onClick={handleLimpar}
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CalculadoraForm;
