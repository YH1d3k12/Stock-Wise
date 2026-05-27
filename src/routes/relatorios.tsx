import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/relatorios")({ component: Relatorios });

const mensal = [
  { m: "Jan", receita: 42, custo: 19 },
  { m: "Fev", receita: 47, custo: 21 },
  { m: "Mar", receita: 51, custo: 22 },
  { m: "Abr", receita: 58, custo: 24 },
  { m: "Mai", receita: 64, custo: 26 },
  { m: "Jun", receita: 72, custo: 28 },
];

const consumo = [
  { name: "Pizzas", v: 38, c: "#10b981" },
  { name: "Hambúrgueres", v: 26, c: "#6366f1" },
  { name: "Bebidas", v: 14, c: "#f59e0b" },
  { name: "Marmitas", v: 12, c: "#ef4444" },
  { name: "Outros", v: 10, c: "#8b5cf6" },
];

const desperdicio = [
  { i: "Arroz", v: 1.4 },
  { i: "Salada", v: 1.1 },
  { i: "Pão", v: 0.8 },
  { i: "Queijo", v: 0.5 },
  { i: "Carne", v: 0.3 },
];

function Relatorios() {
  return (
    <AppLayout title="Relatórios" subtitle="Análises de vendas, custo, desperdício e lucratividade">
      <Tabs defaultValue="financeiro">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="consumo">Consumo</TabsTrigger>
          <TabsTrigger value="desperdicio">Desperdício</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="mt-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Receita vs Custo (últimos 6 meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={mensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="custo" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumo" className="mt-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Distribuição de vendas por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={consumo} dataKey="v" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
                    {consumo.map((e) => <Cell key={e.name} fill={e.c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="desperdicio" className="mt-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Desperdício semanal (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={desperdicio}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="i" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="v" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estoque" className="mt-5">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-8 text-sm text-slate-500">
              Relatório completo de movimentação de estoque, entradas, saídas e divergências.
              Exporte em PDF ou Excel para enviar ao seu contador.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
