import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/vendas")({ component: Vendas });

const vendas = [
  { id: "#10428", produto: "Pizza Calabresa Grande", qtd: 2, hora: "20:42", valor: 260, custo: 144, lucro: 116 },
  { id: "#10427", produto: "X-Burger BBQ", qtd: 3, hora: "20:35", valor: 117, custo: 34, lucro: 83 },
  { id: "#10426", produto: "Cappuccino", qtd: 4, hora: "20:18", valor: 56, custo: 12, lucro: 44 },
  { id: "#10425", produto: "Marmita Executiva", qtd: 6, hora: "12:52", valor: 144, custo: 88, lucro: 56 },
  { id: "#10424", produto: "Pizza Margherita Grande", qtd: 1, hora: "12:41", valor: 110, custo: 53, lucro: 57 },
  { id: "#10423", produto: "Combo Família", qtd: 1, hora: "12:30", valor: 189, custo: 134, lucro: 55 },
  { id: "#10422", produto: "Suco Natural", qtd: 5, hora: "12:15", valor: 60, custo: 18, lucro: 42 },
  { id: "#10421", produto: "Hambúrguer Artesanal", qtd: 2, hora: "11:58", valor: 78, custo: 26, lucro: 52 },
];

function Vendas() {
  const total = vendas.reduce((a, v) => a + v.valor, 0);
  const lucro = vendas.reduce((a, v) => a + v.lucro, 0);
  const qtd = vendas.reduce((a, v) => a + v.qtd, 0);

  return (
    <AppLayout title="Vendas" subtitle="Cada venda, seu custo real e o lucro gerado">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <Tabs defaultValue="dia">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="dia">Hoje</TabsTrigger>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mês</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button className="bg-blue-600 hover:bg-blue-700"><Receipt className="h-4 w-4 mr-2" /> Nova venda</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total faturado", v: `R$ ${total.toLocaleString("pt-BR")}`, i: DollarSign, c: "bg-emerald-50 text-emerald-600" },
          { l: "Lucro do dia", v: `R$ ${lucro.toLocaleString("pt-BR")}`, i: TrendingUp, c: "bg-blue-50 text-blue-600" },
          { l: "Produtos vendidos", v: qtd, i: ShoppingBag, c: "bg-indigo-50 text-indigo-600" },
          { l: "Ticket médio", v: `R$ ${(total / vendas.length).toFixed(2)}`, i: Receipt, c: "bg-purple-50 text-purple-600" },
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
        <CardHeader>
          <CardTitle className="text-base">Histórico de vendas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead>Pedido</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Custo insumos</TableHead>
                <TableHead className="text-right">Lucro</TableHead>
                <TableHead className="text-right">Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((v) => {
                const margem = (v.lucro / v.valor) * 100;
                return (
                  <TableRow key={v.id} className="border-slate-100">
                    <TableCell className="font-mono text-xs text-slate-500">{v.id}</TableCell>
                    <TableCell className="font-medium">{v.produto}</TableCell>
                    <TableCell className="text-center">{v.qtd}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{v.hora}</TableCell>
                    <TableCell className="text-right font-medium">R$ {v.valor.toFixed(2)}</TableCell>
                    <TableCell className="text-right text-slate-500">R$ {v.custo.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">R$ {v.lucro.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={margem > 50 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : margem > 35 ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                        {margem.toFixed(0)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
