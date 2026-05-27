import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertCircle, Package2, Calculator } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/insumos")({ component: Insumos });

// Cadastro real: valorPago por qtdComprada (na unidade de compra)
// → o sistema deriva o preço proporcional por unidade base (g / ml / un)
const insumos = [
  { nome: "Queijo Mussarela", unCompra: "kg", qtdComprada: 1, valorPago: 42.5, unBase: "g", fator: 1000, estoque: 12000, total: 50000, forn: "Laticínios Vale", status: "baixo" },
  { nome: "Farinha de Trigo", unCompra: "kg", qtdComprada: 1, valorPago: 4.9, unBase: "g", fator: 1000, estoque: 8000, total: 80000, forn: "Moinho Central", status: "critico" },
  { nome: "Carne Bovina", unCompra: "kg", qtdComprada: 1, valorPago: 38.9, unBase: "g", fator: 1000, estoque: 28000, total: 40000, forn: "Frigorífico SP", status: "ok" },
  { nome: "Molho de Tomate", unCompra: "L", qtdComprada: 1, valorPago: 12.0, unBase: "ml", fator: 1000, estoque: 3000, total: 20000, forn: "Conservas Maria", status: "critico" },
  { nome: "Calabresa", unCompra: "kg", qtdComprada: 1, valorPago: 28.0, unBase: "g", fator: 1000, estoque: 14000, total: 25000, forn: "Frigorífico SP", status: "ok" },
  { nome: "Pão de Hambúrguer", unCompra: "un", qtdComprada: 1, valorPago: 1.2, unBase: "un", fator: 1, estoque: 180, total: 400, forn: "Padaria Aurora", status: "baixo" },
  { nome: "Café em Grãos", unCompra: "kg", qtdComprada: 1, valorPago: 58.0, unBase: "g", fator: 1000, estoque: 6000, total: 15000, forn: "Café da Serra", status: "ok" },
  { nome: "Embalagem Pizza M", unCompra: "un", qtdComprada: 1, valorPago: 0.9, unBase: "un", fator: 1, estoque: 24, total: 200, forn: "Embalagens Sul", status: "critico" },
  { nome: "Leite Integral", unCompra: "L", qtdComprada: 1, valorPago: 6.5, unBase: "ml", fator: 1000, estoque: 32000, total: 60000, forn: "Laticínios Vale", status: "ok" },
];

const statusMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  baixo: "bg-amber-100 text-amber-700",
  critico: "bg-red-100 text-red-700",
};

const fmtEstoque = (v: number, un: string) =>
  un === "un"
    ? `${v} un`
    : v >= 1000
      ? `${(v / 1000).toFixed(1)} ${un === "g" ? "kg" : "L"}`
      : `${v} ${un}`;

function Insumos() {
  const totalValor = insumos.reduce(
    (acc, i) => acc + (i.estoque / i.fator) * i.valorPago * i.qtdComprada,
    0,
  );

  return (
    <AppLayout
      title="Insumos & Estoque"
      subtitle="Cadastre o valor pago e a quantidade — o sistema calcula o custo proporcional"
    >
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
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 grid place-items-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Valor em estoque</p>
              <p className="text-xl font-semibold">
                R$ {totalValor.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-red-200 bg-red-50/40 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-red-100 text-red-600 grid place-items-center">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-red-600">Atenção urgente</p>
              <p className="text-xl font-semibold text-red-700">
                {insumos.filter((i) => i.status === "critico").length} insumos
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar insumo, fornecedor..."
            className="pl-9 bg-white"
          />
        </div>
        <Button variant="outline">Sugerir compra</Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" /> Novo Insumo
        </Button>
      </div>

      {/* Desktop: tabela */}
      <Card className="hidden md:block rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              <TableHead>Insumo</TableHead>
              <TableHead>Compra</TableHead>
              <TableHead>Valor pago</TableHead>
              <TableHead className="text-emerald-700">Custo por base</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insumos.map((i) => {
              const custoBase = (i.valorPago * i.qtdComprada) / (i.qtdComprada * i.fator);
              return (
                <TableRow key={i.nome}>
                  <TableCell className="font-medium">{i.nome}</TableCell>
                  <TableCell className="text-slate-600">
                    {i.qtdComprada} {i.unCompra}
                  </TableCell>
                  <TableCell>R$ {i.valorPago.toFixed(2)}</TableCell>
                  <TableCell className="text-emerald-700 font-medium">
                    R$ {custoBase.toFixed(4)}/{i.unBase}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {fmtEstoque(i.estoque, i.unBase)} /{" "}
                    {fmtEstoque(i.total, i.unBase)}
                  </TableCell>
                  <TableCell className="text-slate-600">{i.forn}</TableCell>
                  <TableCell>
                    <Badge className={`${statusMap[i.status]} hover:${statusMap[i.status]}`}>
                      {i.status === "ok"
                        ? "Normal"
                        : i.status === "baixo"
                          ? "Baixo"
                          : "Crítico"}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile: cards */}
      <div className="md:hidden space-y-3">
        {insumos.map((i) => {
          const custoBase = (i.valorPago * i.qtdComprada) / (i.qtdComprada * i.fator);
          return (
            <Card key={i.nome} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">{i.nome}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{i.forn}</p>
                  </div>
                  <Badge className={`${statusMap[i.status]} hover:${statusMap[i.status]} shrink-0`}>
                    {i.status === "ok" ? "Normal" : i.status === "baixo" ? "Baixo" : "Crítico"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                  <div>
                    <p className="text-slate-500">Valor pago</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      R$ {i.valorPago.toFixed(2)} / {i.qtdComprada} {i.unCompra}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Custo unitário</p>
                    <p className="font-semibold text-emerald-700 mt-0.5">
                      R$ {custoBase.toFixed(4)}/{i.unBase}
                    </p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-slate-100">
                    <p className="text-slate-500">Estoque atual</p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {fmtEstoque(i.estoque, i.unBase)} de{" "}
                      {fmtEstoque(i.total, i.unBase)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
        <Calculator className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          Exemplo: 1 kg de Farinha por R$ 4,90 → o sistema entende{" "}
          <span className="font-semibold text-slate-700">1g = R$ 0,0049</span> e
          aplica esse custo automaticamente em cada ficha técnica.
        </span>
      </p>
    </AppLayout>
  );
}
