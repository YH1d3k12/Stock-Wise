import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Warehouse, Package, AlertTriangle, TrendingDown, Plus } from "lucide-react";

export const Route = createFileRoute("/estoque")({ component: Estoque });

const movs = [
  { item: "Queijo Mussarela", entrada: 30, saida: 18, saldo: 12, dias: 4, status: "critico" },
  { item: "Farinha de Trigo", entrada: 80, saida: 72, saldo: 8, dias: 2, status: "critico" },
  { item: "Calabresa Defumada", entrada: 25, saida: 14, saldo: 11, dias: 6, status: "baixo" },
  { item: "Molho de Tomate", entrada: 20, saida: 17, saldo: 3, dias: 1, status: "critico" },
  { item: "Hambúrguer Artesanal 180g", entrada: 200, saida: 124, saldo: 76, dias: 12, status: "ok" },
  { item: "Café em Grãos", entrada: 15, saida: 6, saldo: 9, dias: 18, status: "ok" },
  { item: "Açúcar Refinado", entrada: 50, saida: 14, saldo: 36, dias: 32, status: "ok" },
  { item: "Embalagem Pizza M", entrada: 200, saida: 176, saldo: 24, dias: 3, status: "baixo" },
];

const statusMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  baixo: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  critico: "bg-red-100 text-red-700 hover:bg-red-100",
};
const statusLabel: Record<string, string> = { ok: "Normal", baixo: "Baixo", critico: "Crítico" };

function Estoque() {
  return (
    <AppLayout title="Estoque" subtitle="Controle automático baseado em vendas reais">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Itens em estoque", v: "142", i: Package, c: "bg-blue-50 text-blue-600" },
          { l: "Valor estocado", v: "R$ 38.420", i: Warehouse, c: "bg-emerald-50 text-emerald-600" },
          { l: "Alertas críticos", v: "3", i: AlertTriangle, c: "bg-red-50 text-red-600" },
          { l: "Giro médio", v: "11 dias", i: TrendingDown, c: "bg-purple-50 text-purple-600" },
        ].map((m) => (
          <Card key={m.l} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{m.l}</p>
                <p className="text-2xl font-semibold mt-1">{m.v}</p>
              </div>
              <div className={`grid place-items-center h-10 w-10 rounded-xl ${m.c}`}>
                <m.i className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Movimentação por item</CardTitle>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700"><Plus className="h-4 w-4 mr-1" /> Entrada</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {movs.map((m) => {
            const pct = Math.min(100, (m.saldo / Math.max(m.entrada, 1)) * 100);
            return (
              <div key={m.item} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-4">
                  <div className="font-medium text-sm text-slate-800">{m.item}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Cobertura: {m.dias} dias</div>
                </div>
                <div className="col-span-4 md:col-span-2 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Entrada</div>
                  <div className="font-medium text-emerald-600">+{m.entrada}</div>
                </div>
                <div className="col-span-4 md:col-span-2 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Saída</div>
                  <div className="font-medium text-slate-700">-{m.saida}</div>
                </div>
                <div className="col-span-4 md:col-span-2 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Saldo</div>
                  <div className="font-semibold">{m.saldo}</div>
                </div>
                <div className="col-span-12 md:col-span-2 flex md:justify-end">
                  <Badge className={statusMap[m.status]}>{statusLabel[m.status]}</Badge>
                </div>
                <div className="col-span-12">
                  <Progress value={pct} className={m.status === "critico" ? "[&>div]:bg-red-500" : m.status === "baixo" ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
