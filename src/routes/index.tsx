import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  Boxes,
  Sparkles,
  Percent,
  Recycle,
  PiggyBank,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export const Route = createFileRoute("/")({ component: Dashboard });

const sales = [
  { d: "Seg", vendas: 4200, custo: 1820, lucro: 2380 },
  { d: "Ter", vendas: 5800, custo: 2210, lucro: 3590 },
  { d: "Qua", vendas: 5100, custo: 2040, lucro: 3060 },
  { d: "Qui", vendas: 7300, custo: 2840, lucro: 4460 },
  { d: "Sex", vendas: 9620, custo: 3650, lucro: 5970 },
  { d: "Sáb", vendas: 12400, custo: 4480, lucro: 7920 },
  { d: "Dom", vendas: 8830, custo: 3210, lucro: 5620 },
];

const margin = [
  { m: "Jan", margem: 38 },
  { m: "Fev", margem: 41 },
  { m: "Mar", margem: 39 },
  { m: "Abr", margem: 44 },
  { m: "Mai", margem: 47 },
  { m: "Jun", margem: 46 },
  { m: "Jul", margem: 49 },
];

const topProducts = [
  { nome: "Hambúrguer BBQ", margem: 71 },
  { nome: "Cappuccino", margem: 78 },
  { nome: "Pizza Calabresa", margem: 58 },
  { nome: "X-Burger Clássico", margem: 64 },
  { nome: "Pizza Margherita", margem: 52 },
];

const lowProducts = [
  { nome: "Marmita Executiva", margem: 22 },
  { nome: "Refrigerante 2L", margem: 18 },
  { nome: "Combo Família", margem: 27 },
  { nome: "Pizza 4 Queijos", margem: 31 },
];

const lowStock = [
  { nome: "Queijo Mussarela", restante: 12, total: 50, unidade: "kg" },
  { nome: "Farinha de Trigo", restante: 8, total: 80, unidade: "kg" },
  { nome: "Embalagem Pizza M", restante: 24, total: 200, unidade: "un" },
  { nome: "Molho de Tomate", restante: 3, total: 20, unidade: "L" },
];

function Metric({ label, value, delta, positive, icon: Icon, accent }: any) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">{label}</p>
            <p className="text-lg sm:text-2xl font-semibold mt-1 tracking-tight truncate">{value}</p>
          </div>
          <div className={`grid place-items-center h-8 w-8 sm:h-10 sm:w-10 rounded-xl shrink-0 ${accent}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className={`mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
          {positive ? <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
          <span className="truncate">{delta} <span className="text-slate-400 font-normal hidden sm:inline">vs mês anterior</span></span>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <AppLayout title="Dashboard" subtitle="Transforme estoque em lucro · visão consolidada do mês">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Metric label="Faturamento do mês" value="R$ 184.220" delta="+18,2%" positive icon={DollarSign} accent="bg-emerald-50 text-emerald-600" />
        <Metric label="Lucro líquido" value="R$ 76.480" delta="+22,4%" positive icon={PiggyBank} accent="bg-blue-50 text-blue-600" />
        <Metric label="Produtos vendidos" value="3.842" delta="+9,8%" positive icon={ShoppingBag} accent="bg-indigo-50 text-indigo-600" />
        <Metric label="CMV" value="34,2%" delta="-2,1%" positive icon={Percent} accent="bg-purple-50 text-purple-600" />
        <Metric label="Insumos consumidos" value="R$ 62.940" delta="+6,3%" positive={false} icon={Boxes} accent="bg-slate-100 text-slate-700" />
        <Metric label="Desperdício" value="2,8%" delta="-1,1%" positive icon={Recycle} accent="bg-amber-50 text-amber-600" />
        <Metric label="Margem média" value="46,4%" delta="+3,2%" positive icon={TrendingUp} accent="bg-teal-50 text-teal-600" />
        <Metric label="Estoque baixo" value="7 itens" delta="+2 itens" positive={false} icon={AlertTriangle} accent="bg-red-50 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Vendas, Custo e Lucro</CardTitle>
              <p className="text-xs text-slate-500">Últimos 7 dias · valores em R$</p>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Tempo real</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={sales}>
                <defs>
                  <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="d" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="vendas" stroke="#2563eb" strokeWidth={2} fill="url(#gv)" />
                <Area type="monotone" dataKey="lucro" stroke="#10b981" strokeWidth={2} fill="url(#gl)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" /> Alertas inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { t: "Farinha abaixo de 10kg", d: "Sugestão: comprar 40kg até sexta-feira.", c: "bg-red-50 text-red-700" },
              { t: "Pizza Calabresa: margem baixa", d: "Queda de 8% no último mês. Reavalie o preço.", c: "bg-amber-50 text-amber-700" },
              { t: "Preço do queijo aumentou 12%", d: "Reajuste 4 produtos para manter a margem.", c: "bg-blue-50 text-blue-700" },
              { t: "Desperdício acima da média", d: "Molho de tomate descartou 1,8L esta semana.", c: "bg-orange-50 text-orange-700" },
            ].map((i) => (
              <div key={i.t} className={`rounded-xl p-3 ${i.c}`}>
                <p className="text-sm font-medium">{i.t}</p>
                <p className="text-xs opacity-80 mt-0.5">{i.d}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Evolução da margem</CardTitle>
            <p className="text-xs text-slate-500">Últimos 7 meses</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={margin}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="margem" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> Mais lucrativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="nome" type="category" stroke="#475569" fontSize={11} width={110} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="margem" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" /> Menos lucrativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lowProducts} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="nome" type="category" stroke="#475569" fontSize={11} width={110} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="margem" fill="#ef4444" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm mt-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Estoque baixo · ação recomendada</CardTitle>
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{lowStock.length} itens críticos</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {lowStock.map((s) => {
            const pct = (s.restante / s.total) * 100;
            return (
              <div key={s.nome}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-800">{s.nome}</span>
                  <span className="text-slate-500 text-xs">
                    {s.restante} / {s.total} {s.unidade}
                  </span>
                </div>
                <Progress value={pct} className={pct < 20 ? "[&>div]:bg-red-500" : "[&>div]:bg-amber-500"} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
