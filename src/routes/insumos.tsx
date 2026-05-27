import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertCircle, Package2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/insumos")({ component: Insumos });

const insumos = [
  { nome: "Queijo Mussarela", un: "kg", estoque: 12, total: 50, preco: 42.5, forn: "Laticínios Vale", validade: "12/06/26", status: "baixo" },
  { nome: "Farinha de Trigo", un: "kg", estoque: 8, total: 80, preco: 4.9, forn: "Moinho Central", validade: "30/09/26", status: "critico" },
  { nome: "Carne Bovina (patinho)", un: "kg", estoque: 28, total: 40, preco: 38.9, forn: "Frigorífico SP", validade: "02/06/26", status: "ok" },
  { nome: "Molho de Tomate", un: "L", estoque: 3, total: 20, preco: 12.0, forn: "Conservas Maria", validade: "15/12/26", status: "critico" },
  { nome: "Calabresa", un: "kg", estoque: 14, total: 25, preco: 28.0, forn: "Frigorífico SP", validade: "10/06/26", status: "ok" },
  { nome: "Pão de Hambúrguer", un: "un", estoque: 180, total: 400, preco: 1.2, forn: "Padaria Aurora", validade: "01/06/26", status: "baixo" },
  { nome: "Café em Grãos", un: "kg", estoque: 6, total: 15, preco: 58.0, forn: "Café da Serra", validade: "20/11/26", status: "ok" },
  { nome: "Embalagem Pizza M", un: "un", estoque: 24, total: 200, preco: 0.9, forn: "Embalagens Sul", validade: "—", status: "critico" },
  { nome: "Leite Integral", un: "L", estoque: 32, total: 60, preco: 6.5, forn: "Laticínios Vale", validade: "08/06/26", status: "ok" },
  { nome: "Açúcar Refinado", un: "kg", estoque: 22, total: 50, preco: 5.2, forn: "Mercado Atacado", validade: "30/08/26", status: "ok" },
];

const statusMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  baixo: "bg-amber-100 text-amber-700",
  critico: "bg-red-100 text-red-700",
};

function Insumos() {
  const totalValor = insumos.reduce((acc, i) => acc + i.estoque * i.preco, 0);
  return (
    <AppLayout title="Insumos & Estoque" subtitle="Controle inteligente com baixa automática por venda">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
              <Package2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Itens cadastrados</p>
              <p className="text-xl font-semibold">{insumos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500">Valor em estoque</p>
            <p className="text-xl font-semibold">R$ {totalValor.toFixed(2).replace(".", ",")}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-red-200 bg-red-50/40 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-red-100 text-red-600 grid place-items-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-red-600">Atenção urgente</p>
              <p className="text-xl font-semibold text-red-700">{insumos.filter((i) => i.status === "critico").length} insumos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar insumo, fornecedor..." className="pl-9 bg-white" />
        </div>
        <Button variant="outline">Sugerir compra</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" /> Novo Insumo
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              <TableHead>Insumo</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Custo unit.</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insumos.map((i) => (
              <TableRow key={i.nome}>
                <TableCell className="font-medium">{i.nome}</TableCell>
                <TableCell className="text-slate-600">
                  {i.estoque} / {i.total} {i.un}
                </TableCell>
                <TableCell>R$ {i.preco.toFixed(2)}</TableCell>
                <TableCell className="text-slate-600">{i.forn}</TableCell>
                <TableCell className="text-slate-600">{i.validade}</TableCell>
                <TableCell>
                  <Badge className={`${statusMap[i.status]} hover:${statusMap[i.status]}`}>
                    {i.status === "ok" ? "Normal" : i.status === "baixo" ? "Baixo" : "Crítico"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AppLayout>
  );
}
