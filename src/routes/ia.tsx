import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, AlertTriangle, ShoppingCart, DollarSign } from "lucide-react";

export const Route = createFileRoute("/ia")({ component: IA });

const insights = [
  {
    icon: ShoppingCart,
    color: "emerald",
    title: "Compre mais queijo mussarela esta semana",
    desc: "Seu consumo médio é de 28kg/semana, mas o estoque atual cobre apenas 4 dias. Sugestão: comprar 40kg.",
    action: "Gerar pedido de compra",
  },
  {
    icon: TrendingUp,
    color: "amber",
    title: "O custo da farinha aumentou 12% no último mês",
    desc: "Sua margem na Pizza Margherita caiu de 58% para 52%. Considere reajustar o preço em R$ 1,80.",
    action: "Ajustar preço sugerido",
  },
  {
    icon: AlertTriangle,
    color: "red",
    title: "Desperdício acima da média na Marmita Executiva",
    desc: "Foram descartados 1,3kg de arroz cozido por semana. Reduza a porção em 15g ou ajuste a produção diária.",
    action: "Ver ficha técnica",
  },
  {
    icon: DollarSign,
    color: "blue",
    title: "Cappuccino é seu produto com maior margem (78%)",
    desc: "Combos envolvendo cappuccino podem aumentar o ticket médio em até R$ 6,50.",
    action: "Sugerir combo",
  },
  {
    icon: TrendingUp,
    color: "purple",
    title: "Previsão de vendas para sábado: +32%",
    desc: "Baseado no histórico e clima previsto. Prepare estoque extra de pizza e hambúrguer.",
    action: "Ver previsão completa",
  },
];

const colorMap: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

function IA() {
  return (
    <AppLayout title="StockWise Insights" subtitle="Recomendações automáticas baseadas nos seus dados">
      <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-6">
        <CardContent className="p-6 flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-white/15 grid place-items-center backdrop-blur">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">5 novas recomendações esta semana</h2>
            <p className="text-emerald-50 text-sm mt-0.5">Aplicando todas, sua margem estimada sobe 6,4% no próximo mês.</p>
          </div>
          <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">Aplicar todas</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((i, idx) => {
          const Icon = i.icon;
          return (
            <Card key={idx} className={`rounded-2xl border shadow-sm ${colorMap[i.color]}`}>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/70 grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold">{i.title}</CardTitle>
                  <Badge variant="secondary" className="bg-white/70 text-current text-[10px] mt-1">IA · alta confiança</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 mb-4">{i.desc}</p>
                <Button variant="outline" size="sm" className="bg-white border-current/30 hover:bg-white/80 text-current">
                  {i.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
