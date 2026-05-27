import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/produtos")({ component: Produtos });

const produtos = [
  { nome: "Pizza Calabresa", cat: "Pizzas", preco: 49.9, custo: 18.4, margem: 63, vendas: 142, emoji: "🍕" },
  { nome: "X-Burger Clássico", nota: "carro chefe", cat: "Hambúrgueres", preco: 28.5, custo: 10.2, margem: 64, vendas: 128, emoji: "🍔" },
  { nome: "Cappuccino", cat: "Bebidas", preco: 12.0, custo: 2.6, margem: 78, vendas: 96, emoji: "☕" },
  { nome: "Pizza Margherita", cat: "Pizzas", preco: 45.0, custo: 21.6, margem: 52, vendas: 84, emoji: "🍕" },
  { nome: "Marmita Executiva", cat: "Marmitas", preco: 24.9, custo: 14.7, margem: 41, vendas: 71, emoji: "🍱" },
  { nome: "Brownie Caseiro", cat: "Doces", preco: 14.0, custo: 4.1, margem: 71, vendas: 58, emoji: "🍫" },
  { nome: "Pão de Queijo (6un)", cat: "Padaria", preco: 18.0, custo: 5.8, margem: 68, vendas: 52, emoji: "🥖" },
  { nome: "Açaí 500ml", cat: "Sobremesas", preco: 22.0, custo: 8.9, margem: 60, vendas: 47, emoji: "🍨" },
];

function Produtos() {
  return (
    <AppLayout title="Produtos" subtitle="Catálogo completo com fichas técnicas e margem">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar produto..." className="pl-9 bg-white" />
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {produtos.map((p) => (
          <Card key={p.nome} className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 grid place-items-center text-6xl mb-3">
                {p.emoji}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{p.nome}</h3>
                  <Badge variant="secondary" className="mt-1 text-[10px] bg-slate-100 text-slate-600">{p.cat}</Badge>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div>
                  <p className="text-slate-500">Preço</p>
                  <p className="font-semibold text-slate-900">R$ {p.preco.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Custo</p>
                  <p className="font-semibold text-slate-900">R$ {p.custo.toFixed(2)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <TrendingUp className="h-3.5 w-3.5" /> {p.margem}% margem
                </div>
                <span className="text-xs text-slate-500">{p.vendas} vendas</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
