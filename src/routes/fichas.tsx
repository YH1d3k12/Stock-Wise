import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/fichas")({ component: Fichas });

const fichas = [
  {
    nome: "Pizza Calabresa",
    emoji: "🍕",
    preco: 49.9,
    custo: 18.4,
    ingredientes: [
      { i: "Farinha de Trigo", q: "300g", c: 1.47 },
      { i: "Molho de Tomate", q: "80ml", c: 0.96 },
      { i: "Queijo Mussarela", q: "150g", c: 6.38 },
      { i: "Calabresa", q: "80g", c: 2.24 },
      { i: "Azeite + Orégano", q: "10ml", c: 0.45 },
      { i: "Embalagem Pizza M", q: "1 un", c: 0.9 },
      { i: "Mão de obra + gás", q: "—", c: 6.0 },
    ],
  },
  {
    nome: "X-Burger Clássico",
    emoji: "🍔",
    preco: 28.5,
    custo: 10.2,
    ingredientes: [
      { i: "Pão de Hambúrguer", q: "1 un", c: 1.2 },
      { i: "Carne Bovina (patinho)", q: "120g", c: 4.67 },
      { i: "Queijo Mussarela", q: "20g", c: 0.85 },
      { i: "Molho da casa", q: "15g", c: 0.4 },
      { i: "Alface + Tomate", q: "—", c: 0.6 },
      { i: "Mão de obra + gás", q: "—", c: 2.5 },
    ],
  },
];

function Fichas() {
  return (
    <AppLayout title="Fichas Técnicas" subtitle="Receita exata e custo real de cada produto">
      <div className="flex justify-end mb-5">
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" /> Nova ficha
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {fichas.map((f) => {
          const margem = (((f.preco - f.custo) / f.preco) * 100).toFixed(0);
          return (
            <Card key={f.nome} className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 grid place-items-center text-4xl">
                  {f.emoji}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base">{f.nome}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Margem {margem}%</Badge>
                    <Badge variant="outline">R$ {f.preco.toFixed(2)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {f.ingredientes.map((ing) => (
                    <div key={ing.i} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-800">{ing.i}</p>
                        <p className="text-xs text-slate-500">{ing.q}</p>
                      </div>
                      <span className="font-medium text-slate-700">R$ {ing.c.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-500">Custo total</p>
                    <p className="font-semibold text-slate-900">R$ {f.custo.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Preço venda</p>
                    <p className="font-semibold text-slate-900">R$ {f.preco.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600">Lucro/un</p>
                    <p className="font-semibold text-emerald-700">R$ {(f.preco - f.custo).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}
