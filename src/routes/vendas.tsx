import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Receipt, TrendingUp, DollarSign, ShoppingBag, Upload, CheckCircle2,
  XCircle, AlertCircle, FileText, ChevronRight, Package, Percent,
  ArrowDownLeft, Flame, Trash2,
} from "lucide-react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/vendas")({ component: Vendas });

// ─── Catálogo de insumos ──────────────────────────────────────────────────
const insumosCatalog: Record<string, { nome: string; base: string; precoBase: number }> = {
  trigo:     { nome: "Farinha de Trigo",      base: "g",  precoBase: 0.0049 },
  queijo:    { nome: "Queijo Mussarela",       base: "g",  precoBase: 0.0425 },
  molho:     { nome: "Molho de Tomate",        base: "ml", precoBase: 0.012  },
  calabresa: { nome: "Calabresa",              base: "g",  precoBase: 0.028  },
  carne:     { nome: "Carne Bovina (patinho)", base: "g",  precoBase: 0.0389 },
  pao:       { nome: "Pão de Hambúrguer",      base: "un", precoBase: 1.2    },
  alface:    { nome: "Alface + Tomate",        base: "g",  precoBase: 0.015  },
  azeite:    { nome: "Azeite + Orégano",       base: "ml", precoBase: 0.045  },
  emb_pizza: { nome: "Embalagem Pizza M",      base: "un", precoBase: 0.9    },
  leite:     { nome: "Leite Integral",          base: "ml", precoBase: 0.0065 },
  cafe:      { nome: "Café em Grãos",           base: "g",  precoBase: 0.058  },
  acucar:    { nome: "Açúcar Refinado",         base: "g",  precoBase: 0.0052 },
  chocolate: { nome: "Chocolate em Pó",         base: "g",  precoBase: 0.038  },
};

// ─── Catálogo de produtos ─────────────────────────────────────────────────
type Ingrediente = { insumoId: string; qtd: number };

const catalogoProdutos: Record<string, {
  nome: string; cat: string; preco: number; emoji: string;
  ingredientes: Ingrediente[];
  desperdicio: number;
}> = {
  "Pizza Calabresa": {
    nome: "Pizza Calabresa", cat: "Pizzas", preco: 49.9, emoji: "🍕",
    desperdicio: 0.08,
    ingredientes: [
      { insumoId: "trigo", qtd: 300 }, { insumoId: "molho", qtd: 80 },
      { insumoId: "queijo", qtd: 150 }, { insumoId: "calabresa", qtd: 80 },
      { insumoId: "azeite", qtd: 10 }, { insumoId: "emb_pizza", qtd: 1 },
    ],
  },
  "X-Burger Clássico": {
    nome: "X-Burger Clássico", cat: "Hambúrgueres", preco: 28.5, emoji: "🍔",
    desperdicio: 0.05,
    ingredientes: [
      { insumoId: "pao", qtd: 1 }, { insumoId: "carne", qtd: 120 },
      { insumoId: "queijo", qtd: 20 }, { insumoId: "alface", qtd: 30 },
    ],
  },
  "Cappuccino": {
    nome: "Cappuccino", cat: "Bebidas", preco: 12.0, emoji: "☕",
    desperdicio: 0.03,
    ingredientes: [
      { insumoId: "cafe", qtd: 18 }, { insumoId: "leite", qtd: 180 },
      { insumoId: "acucar", qtd: 10 }, { insumoId: "chocolate", qtd: 5 },
    ],
  },
  "Pizza Margherita": {
    nome: "Pizza Margherita", cat: "Pizzas", preco: 45.0, emoji: "🍕",
    desperdicio: 0.07,
    ingredientes: [
      { insumoId: "trigo", qtd: 300 }, { insumoId: "molho", qtd: 90 },
      { insumoId: "queijo", qtd: 180 }, { insumoId: "emb_pizza", qtd: 1 },
    ],
  },
  "Brownie Caseiro": {
    nome: "Brownie Caseiro", cat: "Doces", preco: 14.0, emoji: "🍫",
    desperdicio: 0.04,
    ingredientes: [
      { insumoId: "trigo", qtd: 60 }, { insumoId: "chocolate", qtd: 40 },
      { insumoId: "acucar", qtd: 50 },
    ],
  },
  "Marmita Executiva": {
    nome: "Marmita Executiva", cat: "Marmitas", preco: 24.9, emoji: "🍱",
    desperdicio: 0.12,
    ingredientes: [
      { insumoId: "carne", qtd: 150 }, { insumoId: "alface", qtd: 60 },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function calcCustoUnit(nomeProduto: string): number {
  const p = catalogoProdutos[nomeProduto];
  if (!p) return 0;
  return p.ingredientes.reduce((sum, ing) => {
    const ins = insumosCatalog[ing.insumoId];
    return sum + (ins ? ins.precoBase * ing.qtd : 0);
  }, 0);
}

// ─── Tipos ────────────────────────────────────────────────────────────────
type Venda = {
  id: string; produto: string; qtd: number; hora: string;
  valor: number; custo: number; lucro: number; origem?: string;
};

type LinhaCSV = {
  pedido_id: string; plataforma: string; data: string; hora: string;
  produto: string; quantidade: string; valor_unitario: string;
  valor_total: string; status: string;
};

type ResultadoImportacao = {
  sucesso: Venda[]; cancelados: LinhaCSV[]; naoEncontrados: LinhaCSV[];
  baixasEstoque: Array<{ insumoId: string; nome: string; consumido: number; unidade: string }>;
};

// ─── Dados iniciais ───────────────────────────────────────────────────────
function makeVenda(id: string, nome: string, qtd: number, hora: string): Venda {
  const p = catalogoProdutos[nome];
  const custoUnit = calcCustoUnit(nome);
  const valor = (p?.preco ?? 0) * qtd;
  const custo = custoUnit * qtd;
  return { id, produto: nome, qtd, hora, valor, custo, lucro: valor - custo };
}

const vendasIniciais: Venda[] = [
  makeVenda("#10428", "Pizza Calabresa",    2, "20:42"),
  makeVenda("#10427", "X-Burger Clássico",  3, "20:35"),
  makeVenda("#10426", "Cappuccino",          4, "20:18"),
  makeVenda("#10425", "Marmita Executiva",   6, "12:52"),
  makeVenda("#10424", "Pizza Margherita",    1, "12:41"),
  makeVenda("#10423", "Brownie Caseiro",     5, "12:30"),
  makeVenda("#10422", "Cappuccino",          3, "12:15"),
  makeVenda("#10421", "X-Burger Clássico",   2, "11:58"),
];

// ─── CSV parser ───────────────────────────────────────────────────────────
function parseCSV(texto: string): LinhaCSV[] {
  const linhas = texto.trim().split("\n").map(l => l.replace(/\r/g, ""));
  const cab = linhas[0].split(",").map(c => c.trim());
  return linhas.slice(1).map(linha => {
    const vals = linha.split(",").map(v => v.trim());
    return cab.reduce((obj, col, i) => ({ ...obj, [col]: vals[i] ?? "" }), {}) as LinhaCSV;
  });
}

// ─────────────────────────────────────────────────────────────────────────
// MODAL DE DETALHE DE VENDA
// ─────────────────────────────────────────────────────────────────────────
function DetalheVendaModal({ venda, onClose }: { venda: Venda | null; onClose: () => void }) {
  if (!venda) return null;
  const p = catalogoProdutos[venda.produto];
  const custoUnit = calcCustoUnit(venda.produto);
  const margem = venda.valor > 0 ? (venda.lucro / venda.valor) * 100 : 0;
  const cmv = venda.valor > 0 ? (venda.custo / venda.valor) * 100 : 0;

  const taxaDesperdicio = p?.desperdicio ?? 0;
  const custoDesperdicio = venda.custo * taxaDesperdicio;
  const lucroReal = venda.lucro - custoDesperdicio;
  const margemReal = venda.valor > 0 ? (lucroReal / venda.valor) * 100 : 0;

  const barData = p?.ingredientes.map((ing) => {
    const ins = insumosCatalog[ing.insumoId];
    return {
      nome: ins?.nome.split(" ")[0] ?? ing.insumoId,
      custo: parseFloat((ins ? ins.precoBase * ing.qtd * venda.qtd : 0).toFixed(3)),
    };
  }).sort((a, b) => b.custo - a.custo) ?? [];

  const gaugeData = [{ value: margem, fill: margem >= 60 ? "#10b981" : margem >= 40 ? "#f59e0b" : "#ef4444" }];

  return (
    <Dialog open={!!venda} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-5xl w-[95vw] h-[88vh] p-0 overflow-hidden flex flex-col gap-0">
        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center gap-4 shrink-0">
          <span className="text-3xl">{p?.emoji ?? "📦"}</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold leading-tight">{venda.produto}</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Pedido {venda.id} · {venda.hora}
              {venda.origem && <span className="ml-2 bg-orange-500/20 text-orange-300 rounded px-1.5 py-0.5 text-[10px]">{venda.origem}</span>}
            </p>
          </div>
          <div className="hidden sm:flex gap-4">
            {[
              { l: "Faturado", v: brl(venda.valor), c: "text-white" },
              { l: "Custo", v: brl(venda.custo), c: "text-amber-300" },
              { l: "Lucro Real", v: brl(lucroReal), c: "text-emerald-400" },
            ].map(k => (
              <div key={k.l} className="text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{k.l}</p>
                <p className={`text-base font-bold ${k.c}`}>{k.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Splitter ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Lado esquerdo: ficha técnica ── */}
          <div className="w-[45%] border-r border-slate-200 overflow-y-auto bg-white flex flex-col">
            <div className="p-5 space-y-4 flex-1">

              {/* Precificação */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5" /> Precificação
                </h3>
                <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  {[
                    { l: "Preço unit. de venda",   v: brl(p?.preco ?? 0),   hi: false },
                    { l: "Custo insumos / un",      v: brl(custoUnit),        hi: false },
                    { l: "Lucro bruto / un",         v: brl((p?.preco ?? 0) - custoUnit), hi: true },
                    { l: "Qtd vendida",             v: `${venda.qtd} un`,    hi: false },
                    { l: "Faturamento total",        v: brl(venda.valor),     hi: false },
                    { l: "Custo total insumos",      v: brl(venda.custo),     hi: false },
                    { l: "Lucro bruto total",        v: brl(venda.lucro),     hi: true },
                  ].map(({ l, v, hi }) => (
                    <div key={l} className={`flex justify-between px-3 py-2 text-sm ${hi ? "bg-emerald-50" : ""}`}>
                      <span className={hi ? "font-medium text-emerald-800" : "text-slate-500"}>{l}</span>
                      <span className={`font-semibold ${hi ? "text-emerald-700" : "text-slate-800"}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Desperdício */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" /> Desperdício estimado
                </h3>
                <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden divide-y divide-amber-100">
                  {[
                    { l: "Taxa de desperdício",     v: `${(taxaDesperdicio * 100).toFixed(0)}%` },
                    { l: "Custo perdido (R$)",       v: brl(custoDesperdicio) },
                    { l: "Lucro real (após perda)",  v: brl(lucroReal) },
                    { l: "Margem real",              v: `${margemReal.toFixed(1)}%` },
                  ].map(({ l, v }) => (
                    <div key={l} className="flex justify-between px-3 py-2 text-sm">
                      <span className="text-amber-800">{l}</span>
                      <span className="font-semibold text-amber-900">{v}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Insumos */}
              {p && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" /> Insumos consumidos
                    <span className="ml-auto text-slate-300 font-normal">× {venda.qtd} un</span>
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {p.ingredientes.map((ing) => {
                      const ins = insumosCatalog[ing.insumoId];
                      if (!ins) return null;
                      const custoIng = ins.precoBase * ing.qtd * venda.qtd;
                      const pct = venda.custo > 0 ? (custoIng / venda.custo) * 100 : 0;
                      return (
                        <div key={ing.insumoId} className="px-3 py-2.5">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="text-sm font-medium text-slate-800">{ins.nome}</p>
                              <p className="text-[10px] text-slate-400">
                                {ing.qtd}{ins.base} × {venda.qtd} = {ing.qtd * venda.qtd}{ins.base}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-slate-700">{brl(custoIng)}</p>
                              <p className="text-[10px] text-slate-400">{pct.toFixed(0)}%</p>
                            </div>
                          </div>
                          <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 shrink-0">
              <Button variant="outline" className="w-full" onClick={onClose}>Fechar</Button>
            </div>
          </div>

          {/* ── Lado direito: dashboard simplificado ── */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-4">

            {/* Custo por insumo + desperdício + lucro real */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Custo por insumo (R$)
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 8, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `R$${v.toFixed(2)}`} />
                  <YAxis type="category" dataKey="nome" fontSize={10} stroke="#94a3b8" width={60} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }}
                    formatter={(val: number) => brl(val)}
                  />
                  <Bar dataKey="custo" fill="#6366f1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Desperdício e lucro real abaixo do gráfico */}
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    <p className="text-xs font-semibold text-amber-700">Desperdício estimado</p>
                  </div>
                  <p className="text-lg font-bold text-amber-800">{brl(custoDesperdicio)}</p>
                  <p className="text-[10px] text-amber-600 mt-0.5">
                    {(taxaDesperdicio * 100).toFixed(0)}% do custo de insumos
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700">Lucro real</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-800">{brl(lucroReal)}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Após descontar desperdício</p>
                </div>
              </div>
            </div>

            {/* Margem de lucro */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Margem de lucro
              </p>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%" outerRadius="100%"
                      startAngle={210} endAngle={-30}
                      data={gaugeData}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar dataKey="value" background={{ fill: "#f1f5f9" }} cornerRadius={8} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className={`text-3xl font-bold ${margem >= 60 ? "text-emerald-600" : margem >= 40 ? "text-amber-500" : "text-red-500"}`}>
                    {margem.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Margem real: <span className="font-semibold text-slate-700">{margemReal.toFixed(1)}%</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    CMV: <span className="font-semibold text-slate-700">{cmv.toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Modal de importação CSV ──────────────────────────────────────────────
function ImportacaoModal({
  resultado, onConfirmar, onCancelar,
}: {
  resultado: ResultadoImportacao | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  if (!resultado) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onCancelar()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-semibold">Importar relatório — Revisão</h2>
        </div>
        <p className="text-sm text-slate-500 -mt-2 mb-4">Confira antes de confirmar a baixa no estoque.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: CheckCircle2, v: resultado.sucesso.length, l: "Pedidos válidos", c: "bg-emerald-50 text-emerald-700", ic: "text-emerald-600" },
              { icon: XCircle,      v: resultado.cancelados.length, l: "Cancelados",   c: "bg-amber-50 text-amber-600",   ic: "text-amber-500" },
              { icon: AlertCircle,  v: resultado.naoEncontrados.length, l: "Não encontrados", c: "bg-red-50 text-red-600", ic: "text-red-500" },
            ].map(({ icon: Icon, v, l, c, ic }) => (
              <div key={l} className={`rounded-xl ${c} p-3 text-center`}>
                <Icon className={`h-5 w-5 ${ic} mx-auto mb-1`} />
                <div className="text-2xl font-semibold">{v}</div>
                <div className="text-xs">{l}</div>
              </div>
            ))}
          </div>

          {resultado.sucesso.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pedidos a registrar
              </p>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      {["Pedido", "Produto", "Qtd", "Faturado", "Lucro"].map(h => (
                        <TableHead key={h} className="text-xs">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.sucesso.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="text-xs font-mono text-slate-500">{v.id}</TableCell>
                        <TableCell className="text-xs font-medium">{v.produto}</TableCell>
                        <TableCell className="text-xs text-center">{v.qtd}</TableCell>
                        <TableCell className="text-xs text-right">{brl(v.valor)}</TableCell>
                        <TableCell className="text-xs text-right text-emerald-600 font-semibold">{brl(v.lucro)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {resultado.baixasEstoque.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <ArrowDownLeft className="h-4 w-4 text-blue-500" /> Baixa automática de insumos
              </p>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs">Insumo</TableHead>
                      <TableHead className="text-xs text-right">Consumo total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultado.baixasEstoque.map((b) => (
                      <TableRow key={b.insumoId}>
                        <TableCell className="text-xs">{b.nome}</TableCell>
                        <TableCell className="text-xs text-right text-red-600 font-medium">-{b.consumido} {b.unidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {resultado.naoEncontrados.length > 0 && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-3">
              <p className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Produtos não cadastrados (ignorados)
              </p>
              {resultado.naoEncontrados.map((l) => (
                <p key={l.pedido_id} className="text-xs text-red-600">{l.pedido_id} — <span className="font-medium">{l.produto}</span></p>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
            <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onConfirmar}
              disabled={resultado.sucesso.length === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" /> Confirmar e dar baixa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────
function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>(vendasIniciais);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [resultadoImport, setResultadoImport] = useState<ResultadoImportacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const total  = vendas.reduce((a, v) => a + v.valor, 0);
  const lucro  = vendas.reduce((a, v) => a + v.lucro, 0);
  const qtdTot = vendas.reduce((a, v) => a + v.qtd, 0);
  const ticket = vendas.length > 0 ? total / vendas.length : 0;

  function processarCSV(texto: string) {
    setCarregando(true);
    setTimeout(() => {
      const linhas = parseCSV(texto);
      const sucesso: Venda[] = [];
      const cancelados: LinhaCSV[] = [];
      const naoEncontrados: LinhaCSV[] = [];
      const consumoTotal: Record<string, number> = {};

      linhas.forEach((linha) => {
        if (linha.status === "cancelado") { cancelados.push(linha); return; }
        const qtdNum = parseInt(linha.quantidade, 10) || 1;
        const p = catalogoProdutos[linha.produto];
        if (!p) { naoEncontrados.push(linha); return; }
        const custoUnit = calcCustoUnit(linha.produto);
        const valor = p.preco * qtdNum;
        const custo = custoUnit * qtdNum;
        sucesso.push({ id: linha.pedido_id, produto: linha.produto, qtd: qtdNum, hora: linha.hora, valor, custo, lucro: valor - custo, origem: linha.plataforma });
        p.ingredientes.forEach((ing) => {
          consumoTotal[ing.insumoId] = (consumoTotal[ing.insumoId] ?? 0) + ing.qtd * qtdNum;
        });
      });

      const baixasEstoque = Object.entries(consumoTotal).map(([insumoId, consumido]) => {
        const ins = insumosCatalog[insumoId];
        return { insumoId, nome: ins?.nome ?? insumoId, consumido, unidade: ins?.base ?? "" };
      });

      setResultadoImport({ sucesso, cancelados, naoEncontrados, baixasEstoque });
      setCarregando(false);
    }, 500);
  }

  function confirmarImportacao() {
    if (!resultadoImport) return;
    setVendas((prev) => [...resultadoImport.sucesso, ...prev]);
    setResultadoImport(null);
  }

  function handleArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => processarCSV(ev.target?.result as string);
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  }

  return (
    <AppLayout title="Vendas" subtitle="Cada venda, seu custo real e o lucro gerado">
      <div className="flex items-center justify-end mb-6 gap-4 flex-wrap">
        <div className="flex gap-2">
          <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleArquivo} />
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => inputRef.current?.click()} disabled={carregando}>
            {carregando
              ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />Processando…</span>
              : <><Upload className="h-4 w-4 mr-2" />Importar Relatório</>}
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Receipt className="h-4 w-4 mr-2" /> Nova venda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total faturado",    v: brl(total),     i: DollarSign,  c: "bg-emerald-50 text-emerald-600" },
          { l: "Lucro do dia",      v: brl(lucro),     i: TrendingUp,  c: "bg-blue-50 text-blue-600" },
          { l: "Produtos vendidos", v: `${qtdTot} un`, i: ShoppingBag, c: "bg-indigo-50 text-indigo-600" },
          { l: "Ticket médio",      v: brl(ticket),    i: Receipt,     c: "bg-purple-50 text-purple-600" },
        ].map((m) => (
          <Card key={m.l} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">{m.l}</p>
                <p className="text-xl font-semibold mt-1">{m.v}</p>
              </div>
              <div className={`grid place-items-center h-10 w-10 rounded-xl ${m.c}`}>
                <m.i className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Histórico de vendas</CardTitle>
          <p className="text-xs text-slate-400">Clique em uma linha para abrir o relatório detalhado</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100">
                <TableHead>Pedido</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Faturado</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">Lucro</TableHead>
                <TableHead className="text-right">Margem</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendas.map((v, idx) => {
                const margem = v.valor > 0 ? (v.lucro / v.valor) * 100 : 0;
                const p = catalogoProdutos[v.produto];
                return (
                  <TableRow
                    key={`${v.id}-${idx}`}
                    className="border-slate-100 cursor-pointer hover:bg-slate-50/80 transition-colors"
                    onClick={() => setVendaSelecionada(v)}
                  >
                    <TableCell className="font-mono text-xs text-slate-400">{v.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p?.emoji ?? "📦"}</span>
                        <div>
                          <p className="font-medium text-sm text-slate-800">{v.produto}</p>
                          <p className="text-[10px] text-slate-400">{p?.cat}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{v.qtd}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{v.hora}</TableCell>
                    <TableCell>
                      {v.origem
                        ? <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">{v.origem}</Badge>
                        : <span className="text-xs text-slate-300">—</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium">{brl(v.valor)}</TableCell>
                    <TableCell className="text-right text-slate-500 text-sm">{brl(v.custo)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600">{brl(v.lucro)}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={margem >= 60 ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : margem >= 40 ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                        {margem.toFixed(0)}%
                      </Badge>
                    </TableCell>
                    <TableCell><ChevronRight className="h-4 w-4 text-slate-300" /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DetalheVendaModal venda={vendaSelecionada} onClose={() => setVendaSelecionada(null)} />
      <ImportacaoModal resultado={resultadoImport} onConfirmar={confirmarImportacao} onCancelar={() => setResultadoImport(null)} />
    </AppLayout>
  );
}