import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Warehouse,
  Package,
  AlertTriangle,
  TrendingDown,
  Plus,
  Search,
  AlertCircle,
  Calculator,
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronRight,
  Building2,
  CalendarClock,
  ShoppingCart,
  BarChart3,
  RefreshCw,
  PackagePlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/estoque")({ component: Estoque });

// ─── dataset unificado ───────────────────────────────────────────────────────
// Combina cadastro de insumo (preço, fornecedor, unidade) + movimentação do mês

interface Insumo {
  id: string;
  nome: string;
  categoria: string;
  unCompra: string;
  qtdComprada: number;
  valorPago: number;
  unBase: string;
  fator: number;
  estoque: number;       // qtd atual na unidade base
  capacidade: number;    // capacidade máxima na unidade base
  minimo: number;        // estoque mínimo de segurança
  forn: string;
  contato: string;
  prazoEntrega: string;
  vencimento: string;
  entrada: number;       // entradas no mês (unidade de compra)
  saida: number;         // saídas no mês  (unidade de compra)
  status: "ok" | "baixo" | "critico";
  historico: { d: string; v: number }[];
}

const insumos: Insumo[] = [
  {
    id: "queijo",
    nome: "Queijo Mussarela",
    categoria: "Laticínios",
    unCompra: "kg", qtdComprada: 1, valorPago: 42.5, unBase: "g", fator: 1000,
    estoque: 12000, capacidade: 50000, minimo: 15000,
    forn: "Laticínios Vale", contato: "(11) 99876-5432", prazoEntrega: "2 dias",
    vencimento: "31/05/2026",
    entrada: 30, saida: 18, status: "baixo",
    historico: [{ d: "S1", v: 30 }, { d: "S2", v: 22 }, { d: "S3", v: 18 }, { d: "S4", v: 12 }],
  },
  {
    id: "farinha",
    nome: "Farinha de Trigo",
    categoria: "Grãos e Farinhas",
    unCompra: "kg", qtdComprada: 1, valorPago: 4.9, unBase: "g", fator: 1000,
    estoque: 8000, capacidade: 80000, minimo: 20000,
    forn: "Moinho Central", contato: "(11) 3344-5566", prazoEntrega: "1 dia",
    vencimento: "12/06/2026",
    entrada: 80, saida: 72, status: "critico",
    historico: [{ d: "S1", v: 80 }, { d: "S2", v: 60 }, { d: "S3", v: 38 }, { d: "S4", v: 8 }],
  },
  {
    id: "carne",
    nome: "Carne Bovina",
    categoria: "Proteínas",
    unCompra: "kg", qtdComprada: 1, valorPago: 38.9, unBase: "g", fator: 1000,
    estoque: 28000, capacidade: 40000, minimo: 10000,
    forn: "Frigorífico SP", contato: "(11) 97654-3210", prazoEntrega: "1 dia",
    vencimento: "29/05/2026",
    entrada: 45, saida: 17, status: "ok",
    historico: [{ d: "S1", v: 40 }, { d: "S2", v: 36 }, { d: "S3", v: 32 }, { d: "S4", v: 28 }],
  },
  {
    id: "molho",
    nome: "Molho de Tomate",
    categoria: "Conservas",
    unCompra: "L", qtdComprada: 1, valorPago: 12.0, unBase: "ml", fator: 1000,
    estoque: 3000, capacidade: 20000, minimo: 5000,
    forn: "Conservas Maria", contato: "(11) 2233-4455", prazoEntrega: "3 dias",
    vencimento: "15/07/2026",
    entrada: 20, saida: 17, status: "critico",
    historico: [{ d: "S1", v: 20 }, { d: "S2", v: 14 }, { d: "S3", v: 8 }, { d: "S4", v: 3 }],
  },
  {
    id: "calabresa",
    nome: "Calabresa",
    categoria: "Proteínas",
    unCompra: "kg", qtdComprada: 1, valorPago: 28.0, unBase: "g", fator: 1000,
    estoque: 14000, capacidade: 25000, minimo: 6000,
    forn: "Frigorífico SP", contato: "(11) 97654-3210", prazoEntrega: "1 dia",
    vencimento: "10/06/2026",
    entrada: 25, saida: 14, status: "ok",
    historico: [{ d: "S1", v: 22 }, { d: "S2", v: 20 }, { d: "S3", v: 17 }, { d: "S4", v: 14 }],
  },
  {
    id: "pao",
    nome: "Pão de Hambúrguer",
    categoria: "Panificação",
    unCompra: "un", qtdComprada: 1, valorPago: 1.2, unBase: "un", fator: 1,
    estoque: 180, capacidade: 400, minimo: 100,
    forn: "Padaria Aurora", contato: "(11) 98877-6655", prazoEntrega: "Diário",
    vencimento: "30/05/2026",
    entrada: 200, saida: 124, status: "baixo",
    historico: [{ d: "S1", v: 200 }, { d: "S2", v: 160 }, { d: "S3", v: 220 }, { d: "S4", v: 180 }],
  },
  {
    id: "cafe",
    nome: "Café em Grãos",
    categoria: "Bebidas",
    unCompra: "kg", qtdComprada: 1, valorPago: 58.0, unBase: "g", fator: 1000,
    estoque: 6000, capacidade: 15000, minimo: 3000,
    forn: "Café da Serra", contato: "(31) 99988-7766", prazoEntrega: "5 dias",
    vencimento: "30/09/2026",
    entrada: 15, saida: 6, status: "ok",
    historico: [{ d: "S1", v: 9 }, { d: "S2", v: 7 }, { d: "S3", v: 7 }, { d: "S4", v: 6 }],
  },
  {
    id: "emb_pizza",
    nome: "Embalagem Pizza M",
    categoria: "Embalagens",
    unCompra: "un", qtdComprada: 1, valorPago: 0.9, unBase: "un", fator: 1,
    estoque: 24, capacidade: 200, minimo: 50,
    forn: "Embalagens Sul", contato: "(41) 3322-1100", prazoEntrega: "4 dias",
    vencimento: "—",
    entrada: 200, saida: 176, status: "critico",
    historico: [{ d: "S1", v: 200 }, { d: "S2", v: 140 }, { d: "S3", v: 80 }, { d: "S4", v: 24 }],
  },
  {
    id: "leite",
    nome: "Leite Integral",
    categoria: "Laticínios",
    unCompra: "L", qtdComprada: 1, valorPago: 6.5, unBase: "ml", fator: 1000,
    estoque: 32000, capacidade: 60000, minimo: 10000,
    forn: "Laticínios Vale", contato: "(11) 99876-5432", prazoEntrega: "2 dias",
    vencimento: "02/06/2026",
    entrada: 60, saida: 28, status: "ok",
    historico: [{ d: "S1", v: 55 }, { d: "S2", v: 48 }, { d: "S3", v: 40 }, { d: "S4", v: 32 }],
  },
];

const consumoMensal = [
  { d: "01", kg: 42 }, { d: "05", kg: 58 }, { d: "10", kg: 51 }, { d: "15", kg: 73 },
  { d: "20", kg: 66 }, { d: "25", kg: 84 }, { d: "30", kg: 92 },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

const statusCfg: Record<string, { label: string; badge: string; bar: string; border: string }> = {
  ok:      { label: "Normal",   badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100", bar: "[&>div]:bg-emerald-500", border: "border-emerald-200" },
  baixo:   { label: "Baixo",    badge: "bg-amber-100 text-amber-700 hover:bg-amber-100",       bar: "[&>div]:bg-amber-500",   border: "border-amber-200"   },
  critico: { label: "Crítico",  badge: "bg-red-100 text-red-700 hover:bg-red-100",             bar: "[&>div]:bg-red-500",     border: "border-red-200"     },
};

const fmt = (v: number, un: string) =>
  un === "un" ? `${v} un`
  : v >= 1000 ? `${(v / 1000).toFixed(1)} ${un === "g" ? "kg" : "L"}`
  : `${v} ${un}`;

const fmtCompra = (v: number, un: string) =>
  un === "un" ? `${v} un` : un === "g" ? `${v} kg` : un === "ml" ? `${v} L` : `${v} ${un}`;

// ─── componente ──────────────────────────────────────────────────────────────

function Estoque() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [selecionado, setSelecionado] = useState<Insumo | null>(null);

  const totalValor = insumos.reduce(
    (acc, i) => acc + (i.estoque / i.fator) * i.valorPago, 0,
  );
  const criticos = insumos.filter(i => i.status === "critico").length;
  const baixos   = insumos.filter(i => i.status === "baixo").length;
  const giroMedio = Math.round(
    insumos.reduce((acc, i) => {
      const saldoCompra = i.estoque / i.fator;
      const saidaDia   = (i.saida / 30) || 0.001;
      return acc + saldoCompra / saidaDia;
    }, 0) / insumos.length,
  );

  const categorias = Array.from(new Set(insumos.map(i => i.categoria)));

  const lista = insumos.filter(i => {
    const mb = busca === "" || i.nome.toLowerCase().includes(busca.toLowerCase()) || i.forn.toLowerCase().includes(busca.toLowerCase());
    const ms = filtroStatus === "todos" || i.status === filtroStatus;
    const mc = filtroCategoria === "todas" || i.categoria === filtroCategoria;
    return mb && ms && mc;
  });

  return (
    <AppLayout
      title="Estoque & Insumos"
      subtitle="Cadastro, movimentação e custo de todos os insumos em um só lugar"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Insumos cadastrados", v: `${insumos.length}`,                      Icon: Package,        c: "bg-blue-50 text-blue-600" },
          { l: "Valor em estoque",    v: `R$ ${totalValor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, Icon: Warehouse, c: "bg-emerald-50 text-emerald-600" },
          { l: "Alertas críticos",    v: `${criticos} insumos`,                      Icon: AlertCircle,    c: "bg-red-50 text-red-600" },
          { l: "Giro médio",          v: `${giroMedio} dias`,                        Icon: TrendingDown,   c: "bg-purple-50 text-purple-600" },
        ].map(k => (
          <Card key={k.l} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 truncate">{k.l}</p>
                <p className="text-xl font-semibold mt-0.5">{k.v}</p>
              </div>
              <div className={`shrink-0 grid place-items-center h-10 w-10 rounded-xl ${k.c}`}>
                <k.Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico consumo */}
      <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-base">Consumo total de insumos no mês</CardTitle>
          <p className="text-xs text-slate-500">Quilos totais consumidos (descontados pelas vendas)</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={consumoMensal}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="d" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Area type="monotone" dataKey="kg" stroke="#2563eb" strokeWidth={2} fill="url(#cg)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filtros + ações */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar insumo ou fornecedor..."
            className="pl-9 bg-white"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-full sm:w-40 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ok">Normal</SelectItem>
            <SelectItem value="baixo">Baixo</SelectItem>
            <SelectItem value="critico">Crítico</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-full sm:w-44 bg-white">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-1.5">
          <ShoppingCart className="h-4 w-4" /> Sugerir compra
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-1.5">
          <Plus className="h-4 w-4" /> Novo Insumo
        </Button>
      </div>

      {/* Avisos rápidos */}
      {(criticos > 0 || baixos > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {criticos > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span><strong>{criticos} insumo{criticos > 1 ? "s" : ""}</strong> com estoque crítico — reposição urgente</span>
            </div>
          )}
          {baixos > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span><strong>{baixos} insumo{baixos > 1 ? "s" : ""}</strong> abaixo do mínimo</span>
            </div>
          )}
        </div>
      )}

      {/* Movimentação detalhada por item */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Movimentação por insumo</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">{lista.length} itens · clique para ver detalhes completos</p>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1">
            <PackagePlus className="h-4 w-4" /> Entrada
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {lista.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">Nenhum insumo encontrado.</div>
          )}

          {lista.map((ins, idx) => {
            const custoBase  = ins.valorPago / ins.fator;
            const pctEstoque = Math.min(100, (ins.estoque / ins.capacidade) * 100);
            const pctMinimo  = Math.min(100, (ins.minimo / ins.capacidade) * 100);
            const saldo      = ins.entrada - ins.saida;
            const cfg        = statusCfg[ins.status];
            const valorTotal = (ins.estoque / ins.fator) * ins.valorPago;

            return (
              <div
                key={ins.id}
                className={`group cursor-pointer border-t border-slate-100 first:border-t-0 hover:bg-slate-50/60 transition-colors ${idx === 0 ? "" : ""}`}
                onClick={() => setSelecionado(ins)}
              >
                {/* linha principal */}
                <div className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    {/* ícone categoria */}
                    <div className="shrink-0 hidden sm:grid place-items-center h-10 w-10 rounded-xl bg-slate-100 text-slate-500 text-[10px] font-bold uppercase leading-tight text-center mt-0.5">
                      {ins.categoria.slice(0, 2)}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* cabeçalho do item */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-900">{ins.nome}</span>
                            <Badge className={`${cfg.badge} text-[11px] px-2 py-0`}>{cfg.label}</Badge>
                            <span className="hidden sm:inline text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{ins.categoria}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />{ins.forn}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />Vence: {ins.vencimento}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calculator className="h-3 w-3" />
                              R$ {custoBase.toFixed(4)}/{ins.unBase}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); setSelecionado(ins); }}>
                                <BarChart3 className="h-4 w-4 mr-2" /> Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={e => e.stopPropagation()}>
                                <ArrowDownToLine className="h-4 w-4 mr-2 text-emerald-600" /> Registrar entrada
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={e => e.stopPropagation()}>
                                <ArrowUpFromLine className="h-4 w-4 mr-2 text-red-500" /> Registrar saída
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={e => e.stopPropagation()}>
                                <Pencil className="h-4 w-4 mr-2" /> Editar cadastro
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={e => e.stopPropagation()} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" /> Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </div>

                      {/* métricas em grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3 mb-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Estoque atual</p>
                          <p className="text-sm font-semibold text-slate-800">{fmt(ins.estoque, ins.unBase)}</p>
                          <p className="text-[11px] text-slate-400">de {fmt(ins.capacidade, ins.unBase)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Mínimo</p>
                          <p className={`text-sm font-semibold ${ins.estoque < ins.minimo ? "text-red-600" : "text-slate-800"}`}>{fmt(ins.minimo, ins.unBase)}</p>
                          <p className="text-[11px] text-slate-400">{ins.estoque < ins.minimo ? "⚠ Abaixo" : "✓ OK"}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Entradas / mês</p>
                          <p className="text-sm font-semibold text-emerald-600">+{fmtCompra(ins.entrada, ins.unBase)}</p>
                          <p className="text-[11px] text-slate-400">R$ {(ins.entrada * ins.valorPago).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Saídas / mês</p>
                          <p className="text-sm font-semibold text-red-500">−{fmtCompra(ins.saida, ins.unBase)}</p>
                          <p className="text-[11px] text-slate-400">R$ {(ins.saida * ins.valorPago).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Saldo do mês</p>
                          <p className={`text-sm font-semibold ${saldo >= 0 ? "text-slate-700" : "text-red-600"}`}>{saldo >= 0 ? "+" : ""}{fmtCompra(saldo, ins.unBase)}</p>
                          <p className="text-[11px] text-slate-400">unid. de compra</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">Valor em estoque</p>
                          <p className="text-sm font-semibold text-slate-800">R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="text-[11px] text-slate-400">R$ {ins.valorPago.toFixed(2)}/{ins.unCompra}</p>
                        </div>
                      </div>

                      {/* barra de estoque */}
                      <div className="relative">
                        <Progress
                          value={pctEstoque}
                          className={`h-2 ${cfg.bar}`}
                        />
                        {/* marcador de mínimo */}
                        <div
                          className="absolute top-0 h-2 w-0.5 bg-slate-400 rounded-full"
                          style={{ left: `${pctMinimo}%` }}
                          title={`Mínimo: ${fmt(ins.minimo, ins.unBase)}`}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400">0</span>
                        <span className="text-[10px] text-slate-400 absolute" style={{ left: `calc(${pctMinimo}% + 1rem)`, position: "relative" }}>
                          {/* espaçador */}
                        </span>
                        <span className="text-[10px] text-slate-400">{fmt(ins.capacidade, ins.unBase)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-slate-500 mt-3 flex items-start gap-1.5">
        <Calculator className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>
          A barra mostra o nível atual vs. capacidade. A linha vertical indica o <strong>estoque mínimo de segurança</strong>.
          Custo por unidade base é calculado automaticamente e aplicado nas fichas técnicas.
        </span>
      </p>

      {/* ── SHEET DETALHE ── */}
      <Sheet open={!!selecionado} onOpenChange={open => !open && setSelecionado(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selecionado && (() => {
            const ins      = selecionado;
            const cfg      = statusCfg[ins.status];
            const custoBase = ins.valorPago / ins.fator;
            const pctEstoque = Math.min(100, (ins.estoque / ins.capacidade) * 100);
            const valorTotal = (ins.estoque / ins.fator) * ins.valorPago;

            return (
              <>
                <SheetHeader className="mb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center h-11 w-11 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-bold uppercase">
                      {ins.categoria.slice(0, 2)}
                    </div>
                    <div>
                      <SheetTitle className="text-lg">{ins.nome}</SheetTitle>
                      <SheetDescription>{ins.categoria} · {ins.forn}</SheetDescription>
                    </div>
                  </div>
                  <Badge className={`${cfg.badge} w-fit mt-1`}>{cfg.label}</Badge>
                </SheetHeader>

                {/* Seção: cadastro */}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Cadastro do insumo</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { l: "Unidade de compra", v: ins.unCompra },
                    { l: "Valor pago",        v: `R$ ${ins.valorPago.toFixed(2)}/${ins.unCompra}` },
                    { l: "Custo por base",    v: `R$ ${custoBase.toFixed(4)}/${ins.unBase}` },
                    { l: "Fator conversão",   v: `1 ${ins.unCompra} = ${ins.fator} ${ins.unBase}` },
                    { l: "Fornecedor",        v: ins.forn },
                    { l: "Contato",           v: ins.contato },
                    { l: "Prazo de entrega",  v: ins.prazoEntrega },
                    { l: "Validade",          v: ins.vencimento },
                  ].map(f => (
                    <div key={f.l} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">{f.l}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5 break-words">{f.v}</p>
                    </div>
                  ))}
                </div>

                {/* Seção: estoque */}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Estoque atual</p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[
                    { l: "Atual",       v: fmt(ins.estoque, ins.unBase),    cor: cfg.badge },
                    { l: "Mínimo",      v: fmt(ins.minimo, ins.unBase),     cor: "bg-amber-100 text-amber-700" },
                    { l: "Capacidade",  v: fmt(ins.capacidade, ins.unBase), cor: "bg-blue-100 text-blue-700" },
                  ].map(f => (
                    <div key={f.l} className="bg-slate-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">{f.l}</p>
                      <Badge className={`${f.cor} mt-1 text-xs`}>{f.v}</Badge>
                    </div>
                  ))}
                </div>
                <Progress value={pctEstoque} className={`h-2.5 mb-1 ${cfg.bar}`} />
                <div className="flex justify-between text-[10px] text-slate-400 mb-5">
                  <span>{Math.round(pctEstoque)}% do total</span>
                  <span>Valor: R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {/* Seção: movimentação */}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Movimentação do mês</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                    <ArrowDownToLine className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-500">Entradas</p>
                    <p className="font-bold text-emerald-700">+{fmtCompra(ins.entrada, ins.unBase)}</p>
                    <p className="text-[11px] text-slate-400">R$ {(ins.entrada * ins.valorPago).toFixed(2)}</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                    <ArrowUpFromLine className="h-4 w-4 text-red-500 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-500">Saídas</p>
                    <p className="font-bold text-red-600">−{fmtCompra(ins.saida, ins.unBase)}</p>
                    <p className="text-[11px] text-slate-400">R$ {(ins.saida * ins.valorPago).toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                    <RefreshCw className="h-4 w-4 text-slate-500 mx-auto mb-1" />
                    <p className="text-[10px] text-slate-500">Saldo</p>
                    <p className={`font-bold ${ins.entrada - ins.saida >= 0 ? "text-slate-700" : "text-red-600"}`}>
                      {ins.entrada - ins.saida >= 0 ? "+" : ""}{fmtCompra(ins.entrada - ins.saida, ins.unBase)}
                    </p>
                    <p className="text-[11px] text-slate-400">no período</p>
                  </div>
                </div>

                {/* gráfico histórico */}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Histórico de estoque (4 semanas)</p>
                <div className="bg-slate-50 rounded-xl p-3 mb-5">
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={ins.historico} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="d" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
                      <Bar dataKey="v" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ações rápidas */}
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Ações</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="gap-2 justify-start">
                    <ArrowDownToLine className="h-4 w-4 text-emerald-600" /> Registrar entrada
                  </Button>
                  <Button variant="outline" className="gap-2 justify-start">
                    <ArrowUpFromLine className="h-4 w-4 text-red-500" /> Registrar saída
                  </Button>
                  <Button variant="outline" className="gap-2 justify-start">
                    <Pencil className="h-4 w-4" /> Editar cadastro
                  </Button>
                  <Button variant="outline" className="gap-2 justify-start">
                    <ShoppingCart className="h-4 w-4 text-blue-600" /> Solicitar compra
                  </Button>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
