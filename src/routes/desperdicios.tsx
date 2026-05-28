import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  ClipboardList,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Search,
  BarChart2,
  Flame,
  Snowflake,
  Scale,
  PackageX,
  Bug,
  RefreshCw,
  Bell,
  ChevronRight,
  FileText,
  UserCheck,
  Pencil,
  X,
  ArrowUpRight,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

export const Route = createFileRoute("/desperdicios")({ component: Desperdicios });

// ─── tipos ───────────────────────────────────────────────────────────────────

type Causa =
  | "vencimento"
  | "excesso_preparo"
  | "acidente"
  | "contaminacao"
  | "armazenamento"
  | "sobra"
  | "medicao"
  | "qualidade";

type StatusTrativa = "pendente" | "em_analise" | "em_tratamento" | "resolvido" | "recorrente";

interface Ocorrencia {
  id: number;
  data: string;
  insumo: string;
  qtd: string;
  custo: number;
  causa: Causa;
  status: StatusTrativa;
  responsavel: string;
  descricao: string;
  plano?: string;
  prazo?: string;
}

// ─── dados mock ───────────────────────────────────────────────────────────────

const ocorrencias: Ocorrencia[] = [
  { id: 1, data: "27/05/2026", insumo: "Queijo Mussarela", qtd: "800g", custo: 34.0, causa: "vencimento", status: "em_tratamento", responsavel: "Carlos Silva", descricao: "Queijo esquecido fora da refrigeração por ~4h. Odor alterado.", plano: "Revisar checklist de fechamento da cozinha. Instalar termômetro na câmara fria.", prazo: "03/06/2026" },
  { id: 2, data: "26/05/2026", insumo: "Farinha de Trigo", qtd: "2kg", custo: 9.8, causa: "armazenamento", status: "resolvido", responsavel: "Ana Costa", descricao: "Embalagem rasgada causou infestação de gorulhos.", plano: "Transferir farinha para potes herméticos no recebimento.", prazo: "28/05/2026" },
  { id: 3, data: "25/05/2026", insumo: "Molho de Tomate", qtd: "500ml", custo: 6.0, causa: "excesso_preparo", status: "pendente", responsavel: "—", descricao: "Excesso preparado no sábado à noite não foi reaproveitado.", prazo: undefined },
  { id: 4, data: "24/05/2026", insumo: "Carne Bovina", qtd: "300g", custo: 11.67, causa: "acidente", status: "resolvido", responsavel: "Pedro Alves", descricao: "Queda da bandeja durante preparo. Piso contaminado.", plano: "Organizar bancada para evitar sobreposição de bandejas.", prazo: "26/05/2026" },
  { id: 5, data: "23/05/2026", insumo: "Pão de Hambúrguer", qtd: "12 un", custo: 14.4, causa: "vencimento", status: "em_analise", responsavel: "Ana Costa", descricao: "Validade expirou sem venda suficiente no dia.", prazo: "30/05/2026" },
  { id: 6, data: "22/05/2026", insumo: "Leite Integral", qtd: "2L", custo: 13.0, causa: "qualidade", status: "em_tratamento", responsavel: "Carlos Silva", descricao: "Lote com odor ácido ao abrir. Possível problema no transporte.", plano: "Solicitar nota de crédito ao fornecedor. Exigir lacre inviolável.", prazo: "29/05/2026" },
  { id: 7, data: "21/05/2026", insumo: "Calabresa", qtd: "500g", custo: 14.0, causa: "sobra", status: "pendente", responsavel: "—", descricao: "Sobra de event catering não aproveitada. Descartada após 48h.", prazo: undefined },
  { id: 8, data: "20/05/2026", insumo: "Café em Grãos", qtd: "200g", custo: 11.6, causa: "medicao", status: "resolvido", responsavel: "Pedro Alves", descricao: "Ficha técnica com dosagem errada calibrou balança incorretamente.", plano: "Recalibrar balança semanalmente. Revisar fichas técnicas de bebidas.", prazo: "22/05/2026" },
];

const planosSugeridos = [
  { id: 1, tipo: "preventivo", titulo: "Checklist diário de validade", descricao: "Inspecionar datas de vencimento de laticínios toda manhã antes do preparo.", prioridade: "alta", status: "ativo", insumos: ["Queijo Mussarela", "Leite Integral"] },
  { id: 2, tipo: "corretivo", titulo: "Treinamento de porcionamento", descricao: "Treinar equipe no uso correto de balanças e porcionadores calibrados.", prioridade: "media", status: "em_andamento", insumos: ["Farinha de Trigo", "Café em Grãos"] },
  { id: 3, tipo: "preventivo", titulo: "Gestão PEPS na câmara fria", descricao: "Garantir que o estoque mais antigo seja sempre usado primeiro (Primeiro a Entrar, Primeiro a Sair).", prioridade: "alta", status: "ativo", insumos: ["Carne Bovina", "Calabresa", "Molho de Tomate"] },
  { id: 4, tipo: "corretivo", titulo: "Renegociação de lotes com fornecedor", descricao: "Solicitar lotes menores de perecíveis para reduzir vencimento em estoque.", prioridade: "media", status: "pendente", insumos: ["Pão de Hambúrguer", "Leite Integral"] },
  { id: 5, tipo: "preventivo", titulo: "Limite de pré-preparo por turno", descricao: "Definir quantidade máxima de preparo antecipado baseado nas vendas dos últimos 7 dias.", prioridade: "baixa", status: "ativo", insumos: ["Molho de Tomate", "Calabresa"] },
];

const alertas = [
  { id: 1, tipo: "vencimento", insumo: "Pão de Hambúrguer", mensagem: "Lote vence em 2 dias. 80 unidades em estoque.", urgencia: "critica" },
  { id: 2, tipo: "limite", insumo: "Queijo Mussarela", mensagem: "Desperdício acumulado no mês: R$ 68,00 (limite: R$ 50,00).", urgencia: "critica" },
  { id: 3, tipo: "vencimento", insumo: "Leite Integral", mensagem: "Lote vence em 4 dias. Consumo atual cobre apenas 60%.", urgencia: "atencao" },
  { id: 4, tipo: "tendencia", insumo: "Molho de Tomate", mensagem: "Desperdício aumentou 40% em relação à semana passada.", urgencia: "atencao" },
  { id: 5, tipo: "armazenamento", insumo: "Carne Bovina", mensagem: "Câmara fria atingiu 6°C — acima do ideal (≤4°C).", urgencia: "critica" },
  { id: 6, tipo: "limite", insumo: "Farinha de Trigo", mensagem: "Desperdício no mês: R$ 19,60 (limite: R$ 40,00). Dentro do esperado.", urgencia: "normal" },
];

const porCausa = [
  { causa: "Vencimento", valor: 48.4, cor: "#ef4444" },
  { causa: "Excesso preparo", valor: 28.0, cor: "#f97316" },
  { causa: "Armazenamento", valor: 19.6, cor: "#eab308" },
  { causa: "Qualidade", valor: 13.0, cor: "#8b5cf6" },
  { causa: "Sobra", valor: 14.0, cor: "#06b6d4" },
  { causa: "Acidente", valor: 11.67, cor: "#64748b" },
  { causa: "Medição", valor: 11.6, cor: "#10b981" },
];

const porInsumo = [
  { nome: "Queijo Mussarela", valor: 34.0 },
  { nome: "Pão de Hambúrguer", valor: 14.4 },
  { nome: "Calabresa", valor: 14.0 },
  { nome: "Leite Integral", valor: 13.0 },
  { nome: "Café em Grãos", valor: 11.6 },
  { nome: "Carne Bovina", valor: 11.67 },
  { nome: "Molho de Tomate", valor: 6.0 },
];

const evolucaoSemanal = [
  { semana: "S1", valor: 62 },
  { semana: "S2", valor: 88 },
  { semana: "S3", valor: 71 },
  { semana: "S4", valor: 146.47 },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

const causaConfig: Record<Causa, { label: string; Icon: React.FC<{ className?: string }>; cor: string }> = {
  vencimento:     { label: "Vencimento",           Icon: Clock,      cor: "bg-red-100 text-red-700" },
  excesso_preparo:{ label: "Excesso de preparo",    Icon: Flame,      cor: "bg-orange-100 text-orange-700" },
  acidente:       { label: "Acidente / Queda",      Icon: AlertTriangle, cor: "bg-slate-100 text-slate-700" },
  contaminacao:   { label: "Contaminação",          Icon: Bug,        cor: "bg-purple-100 text-purple-700" },
  armazenamento:  { label: "Armazenamento",         Icon: Snowflake,  cor: "bg-blue-100 text-blue-700" },
  sobra:          { label: "Sobra não aproveitada", Icon: PackageX,   cor: "bg-cyan-100 text-cyan-700" },
  medicao:        { label: "Erro de medição",       Icon: Scale,      cor: "bg-emerald-100 text-emerald-700" },
  qualidade:      { label: "Qualidade abaixo",      Icon: ShieldCheck, cor: "bg-pink-100 text-pink-700" },
};

const statusConfig: Record<StatusTrativa, { label: string; cor: string }> = {
  pendente:       { label: "Pendente",           cor: "bg-slate-100 text-slate-600" },
  em_analise:     { label: "Em análise",          cor: "bg-blue-100 text-blue-700" },
  em_tratamento:  { label: "Em tratamento",       cor: "bg-amber-100 text-amber-700" },
  resolvido:      { label: "Resolvido",           cor: "bg-emerald-100 text-emerald-700" },
  recorrente:     { label: "Recorrente",          cor: "bg-red-100 text-red-700" },
};

const urgenciaConfig: Record<string, { label: string; cor: string; border: string }> = {
  critica: { label: "Crítica", cor: "bg-red-100 text-red-700", border: "border-red-200" },
  atencao: { label: "Atenção", cor: "bg-amber-100 text-amber-700", border: "border-amber-200" },
  normal:  { label: "Normal",  cor: "bg-emerald-100 text-emerald-700", border: "border-emerald-200" },
};

const alertaIcone: Record<string, React.FC<{ className?: string }>> = {
  vencimento:   Clock,
  limite:       TrendingDown,
  tendencia:    BarChart2,
  armazenamento: Snowflake,
};

const totalMes = ocorrencias.reduce((s, o) => s + o.custo, 0);
const pendentes = ocorrencias.filter(o => o.status === "pendente").length;
const resolvidos = ocorrencias.filter(o => o.status === "resolvido").length;
const alertasCriticos = alertas.filter(a => a.urgencia === "critica").length;

// ─── componente principal ────────────────────────────────────────────────────

function Desperdicios() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroCausa, setFiltroCausa] = useState<string>("todas");
  const [selecionado, setSelecionado] = useState<Ocorrencia | null>(null);
  const [sheetTipo, setSheetTipo] = useState<"detalhes" | "registrar" | "plano">("detalhes");
  const [sheetAberto, setSheetAberto] = useState(false);

  const abrirDetalhes = (o: Ocorrencia) => {
    setSelecionado(o);
    setSheetTipo("detalhes");
    setSheetAberto(true);
  };

  const abrirRegistrar = () => {
    setSelecionado(null);
    setSheetTipo("registrar");
    setSheetAberto(true);
  };

  const ocFiltradas = ocorrencias.filter(o => {
    const matchBusca = busca === "" || o.insumo.toLowerCase().includes(busca.toLowerCase()) || o.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || o.status === filtroStatus;
    const matchCausa = filtroCausa === "todas" || o.causa === filtroCausa;
    return matchBusca && matchStatus && matchCausa;
  });

  return (
    <AppLayout
      title="Desperdícios de Insumos"
      subtitle="Registre, analise e trate todas as ocorrências de perda de insumos"
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Perdas no mês", valor: `R$ ${totalMes.toFixed(2).replace(".", ",")}`, Icon: DollarSign, bg: "bg-red-50 text-red-600", trend: "+18% vs mês anterior" },
          { label: "Ocorrências", valor: `${ocorrencias.length}`, Icon: ClipboardList, bg: "bg-slate-100 text-slate-600", trend: `${pendentes} pendentes` },
          { label: "Alertas críticos", valor: `${alertasCriticos}`, Icon: Bell, bg: "bg-amber-50 text-amber-600", trend: "Ação imediata" },
          { label: "Resolvidas", valor: `${resolvidos}`, Icon: CheckCircle2, bg: "bg-emerald-50 text-emerald-600", trend: `${Math.round((resolvidos / ocorrencias.length) * 100)}% do total` },
        ].map((k) => (
          <Card key={k.label} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-500 truncate">{k.label}</p>
                <p className="text-xl font-semibold mt-0.5">{k.valor}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{k.trend}</p>
              </div>
              <div className={`shrink-0 grid place-items-center h-10 w-10 rounded-xl ${k.bg}`}>
                <k.Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ocorrencias">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <TabsList className="bg-slate-100 rounded-xl p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="ocorrencias" className="rounded-lg text-xs sm:text-sm">Ocorrências</TabsTrigger>
            <TabsTrigger value="planos" className="rounded-lg text-xs sm:text-sm">Planos de Ação</TabsTrigger>
            <TabsTrigger value="alertas" className="rounded-lg text-xs sm:text-sm">
              Alertas
              {alertasCriticos > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold">{alertasCriticos}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="analise" className="rounded-lg text-xs sm:text-sm">Análise</TabsTrigger>
          </TabsList>
          <Button onClick={abrirRegistrar} className="bg-red-600 hover:bg-red-700 gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Registrar desperdício
          </Button>
        </div>

        {/* ── ABA: OCORRÊNCIAS ── */}
        <TabsContent value="ocorrencias" className="mt-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por insumo ou descrição..."
                className="pl-9 bg-white"
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-44 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em análise</SelectItem>
                <SelectItem value="em_tratamento">Em tratamento</SelectItem>
                <SelectItem value="resolvido">Resolvido</SelectItem>
                <SelectItem value="recorrente">Recorrente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroCausa} onValueChange={setFiltroCausa}>
              <SelectTrigger className="w-full sm:w-52 bg-white">
                <SelectValue placeholder="Causa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as causas</SelectItem>
                {Object.entries(causaConfig).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: tabela */}
          <Card className="hidden md:block rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/60">
                  <TableHead>Data</TableHead>
                  <TableHead>Insumo</TableHead>
                  <TableHead>Causa</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Custo da perda</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Trativa</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ocFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-slate-400">
                      Nenhuma ocorrência encontrada.
                    </TableCell>
                  </TableRow>
                )}
                {ocFiltradas.map(o => {
                  const causa = causaConfig[o.causa];
                  const st = statusConfig[o.status];
                  return (
                    <TableRow key={o.id} className="cursor-pointer hover:bg-slate-50/50" onClick={() => abrirDetalhes(o)}>
                      <TableCell className="text-slate-500 text-sm">{o.data}</TableCell>
                      <TableCell className="font-medium">{o.insumo}</TableCell>
                      <TableCell>
                        <Badge className={`${causa.cor} gap-1 text-xs`}>
                          <causa.Icon className="h-3 w-3" />
                          {causa.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{o.qtd}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        R$ {o.custo.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="text-slate-600">{o.responsavel}</TableCell>
                      <TableCell>
                        <Badge className={`${st.cor} text-xs`}>{st.label}</Badge>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => abrirDetalhes(o)}>
                              <FileText className="h-4 w-4 mr-2" /> Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" /> Atribuir responsável
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardList className="h-4 w-4 mr-2" /> Criar plano de ação
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Marcar resolvido
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2 text-amber-600" /> Marcar recorrente
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile: cards */}
          <div className="md:hidden space-y-3">
            {ocFiltradas.map(o => {
              const causa = causaConfig[o.causa];
              const st = statusConfig[o.status];
              return (
                <Card key={o.id} className="rounded-2xl border-slate-200 shadow-sm cursor-pointer" onClick={() => abrirDetalhes(o)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{o.insumo}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{o.data} · {o.responsavel}</p>
                      </div>
                      <Badge className={`${st.cor} text-xs shrink-0`}>{st.label}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{o.descricao}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={`${causa.cor} gap-1 text-xs`}>
                        <causa.Icon className="h-3 w-3" />
                        {causa.label}
                      </Badge>
                      <span className="font-semibold text-red-600 text-sm">
                        − R$ {o.custo.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── ABA: PLANOS DE AÇÃO ── */}
        <TabsContent value="planos" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            {[
              { label: "Ativos", valor: planosSugeridos.filter(p => p.status === "ativo").length, cor: "text-emerald-600" },
              { label: "Em andamento", valor: planosSugeridos.filter(p => p.status === "em_andamento").length, cor: "text-amber-600" },
              { label: "Pendentes", valor: planosSugeridos.filter(p => p.status === "pendente").length, cor: "text-slate-500" },
            ].map(m => (
              <Card key={m.label} className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <p className={`text-3xl font-bold ${m.cor}`}>{m.valor}</p>
                  <p className="text-sm text-slate-500">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {planosSugeridos.map(p => {
            const priorCor = p.prioridade === "alta" ? "bg-red-100 text-red-700" : p.prioridade === "media" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600";
            const tipoCor = p.tipo === "preventivo" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700";
            const stCor = p.status === "ativo" ? "bg-emerald-100 text-emerald-700" : p.status === "em_andamento" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500";
            const stLabel = p.status === "ativo" ? "Ativo" : p.status === "em_andamento" ? "Em andamento" : "Pendente";
            return (
              <Card key={p.id} className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge className={`${tipoCor} text-xs`}>{p.tipo === "preventivo" ? "Preventivo" : "Corretivo"}</Badge>
                        <Badge className={`${priorCor} text-xs`}>Prioridade {p.prioridade}</Badge>
                        <Badge className={`${stCor} text-xs`}>{stLabel}</Badge>
                      </div>
                      <h3 className="font-semibold text-slate-800">{p.titulo}</h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" /> Editar plano</DropdownMenuItem>
                        <DropdownMenuItem><UserCheck className="h-4 w-4 mr-2" /> Atribuir responsável</DropdownMenuItem>
                        <DropdownMenuItem><CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Concluir</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Remover</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{p.descricao}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs text-slate-400 self-center">Insumos:</span>
                    {p.insumos.map(ins => (
                      <span key={ins} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ins}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Button variant="outline" className="w-full gap-2">
            <Plus className="h-4 w-4" /> Criar novo plano de ação
          </Button>
        </TabsContent>

        {/* ── ABA: ALERTAS ── */}
        <TabsContent value="alertas" className="mt-0 space-y-3">
          <div className="flex items-center gap-2 mb-1 text-sm text-slate-500">
            <Bell className="h-4 w-4" />
            <span>{alertas.filter(a => a.urgencia === "critica").length} alertas críticos · {alertas.filter(a => a.urgencia === "atencao").length} de atenção</span>
          </div>
          {alertas
            .sort((a, b) => (a.urgencia === "critica" ? -1 : b.urgencia === "critica" ? 1 : 0))
            .map(a => {
              const cfg = urgenciaConfig[a.urgencia];
              const Icon = alertaIcone[a.tipo] ?? Bell;
              return (
                <Card key={a.id} className={`rounded-2xl border shadow-sm ${cfg.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 grid place-items-center h-9 w-9 rounded-xl ${cfg.cor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-slate-800 text-sm">{a.insumo}</p>
                          <Badge className={`${cfg.cor} text-[10px]`}>{cfg.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-500">{a.mensagem}</p>
                      </div>
                      {a.urgencia !== "normal" && (
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Tratar
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-slate-400">
                            <X className="h-3 w-3 mr-1" /> Ignorar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          <Card className="rounded-2xl border-dashed border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <p className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" /> Configurar limites de alerta
              </p>
              <div className="space-y-3">
                {[
                  { label: "Limite de desperdício mensal por insumo", valor: "R$ 50,00" },
                  { label: "Alertar vencimento com antecedência de", valor: "3 dias" },
                  { label: "Temperatura máxima da câmara fria", valor: "4°C" },
                ].map(cfg => (
                  <div key={cfg.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <p className="text-xs text-slate-500">{cfg.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">{cfg.valor}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Pencil className="h-3.5 w-3.5 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ABA: ANÁLISE ── */}
        <TabsContent value="analise" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Perdas por causa (R$)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={porCausa} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={v => `R$${v}`} />
                    <YAxis dataKey="causa" type="category" stroke="#94a3b8" fontSize={11} width={110} />
                    <Tooltip formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Perda"]} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
                      {porCausa.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">Insumos com maiores perdas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {porInsumo.map((item, i) => {
                  const pct = Math.round((item.valor / porInsumo[0].valor) * 100);
                  return (
                    <div key={item.nome}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">{i + 1}. {item.nome}</span>
                        <span className="text-xs font-semibold text-red-600">R$ {item.valor.toFixed(2)}</span>
                      </div>
                      <Progress value={pct} className="h-1.5 [&>div]:bg-red-400" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm">Evolução de perdas por semana (R$)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={evolucaoSemanal}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="semana" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `R$${v}`} />
                    <Tooltip formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Perdas"]} contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Bar dataKey="valor" fill="#ef4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {evolucaoSemanal[3].valor > evolucaoSemanal[2].valor && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 rounded-xl border border-red-100">
                    <ArrowUpRight className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-700">
                      As perdas da semana 4 foram <strong>+{Math.round(((evolucaoSemanal[3].valor - evolucaoSemanal[2].valor) / evolucaoSemanal[2].valor) * 100)}%</strong> acima da semana anterior.
                      Revise os planos de ação em andamento.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ranking de causas por frequência */}
          <Card className="rounded-2xl border-slate-200 shadow-sm mt-5">
            <CardHeader>
              <CardTitle className="text-sm">Resumo de trativas por status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(statusConfig).map(([k, v]) => {
                  const total = ocorrencias.filter(o => o.status === k).length;
                  const pct = Math.round((total / ocorrencias.length) * 100);
                  return (
                    <div key={k} className="text-center">
                      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-full ${v.cor} text-lg font-bold mb-1`}>
                        {total}
                      </div>
                      <p className="text-xs text-slate-500">{v.label}</p>
                      <p className="text-[11px] text-slate-400">{pct}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── SHEET: DETALHES / TRATIVAS ── */}
      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {sheetTipo === "detalhes" && selecionado && (
            <>
              <SheetHeader className="mb-5">
                <SheetTitle>Ocorrência #{selecionado.id}</SheetTitle>
                <SheetDescription>Detalhes e trativas disponíveis</SheetDescription>
              </SheetHeader>

              {/* cabeçalho */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${causaConfig[selecionado.causa].cor} gap-1`}>
                    {(() => { const I = causaConfig[selecionado.causa].Icon; return <I className="h-3 w-3" />; })()}
                    {causaConfig[selecionado.causa].label}
                  </Badge>
                  <Badge className={statusConfig[selecionado.status].cor}>
                    {statusConfig[selecionado.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Insumo", v: selecionado.insumo },
                    { l: "Data", v: selecionado.data },
                    { l: "Quantidade", v: selecionado.qtd },
                    { l: "Custo da perda", v: `R$ ${selecionado.custo.toFixed(2).replace(".", ",")}` },
                    { l: "Responsável", v: selecionado.responsavel },
                    { l: "Prazo", v: selecionado.prazo ?? "Não definido" },
                  ].map(f => (
                    <div key={f.l} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">{f.l}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5">{f.v}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Descrição</p>
                  <p className="text-sm text-slate-700">{selecionado.descricao}</p>
                </div>

                {selecionado.plano && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">Plano de ação</p>
                    <p className="text-sm text-blue-800">{selecionado.plano}</p>
                  </div>
                )}

                {/* trativas disponíveis */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Trativas disponíveis</p>
                  <div className="space-y-2">
                    {[
                      { label: "Atribuir responsável", Icon: UserCheck, desc: "Definir quem vai tratar esta ocorrência" },
                      { label: "Criar/editar plano de ação", Icon: ClipboardList, desc: "Descrever ações corretivas e preventivas" },
                      { label: "Definir prazo de resolução", Icon: Clock, desc: "Estipular data limite para encerramento" },
                      { label: "Marcar como resolvido", Icon: CheckCircle2, desc: "Confirmar que a causa foi tratada", cor: "text-emerald-600" },
                      { label: "Escalar para recorrente", Icon: RefreshCw, desc: "Indicar que a ocorrência se repete", cor: "text-amber-600" },
                      { label: "Ajustar estoque", Icon: PackageX, desc: "Baixar o insumo perdido do estoque" },
                      { label: "Gerar relatório", Icon: FileText, desc: "Exportar detalhes desta ocorrência" },
                    ].map(t => (
                      <button
                        key={t.label}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className="shrink-0 grid place-items-center h-8 w-8 rounded-lg bg-slate-100">
                          <t.Icon className={`h-4 w-4 ${t.cor ?? "text-slate-600"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${t.cor ?? "text-slate-800"}`}>{t.label}</p>
                          <p className="text-xs text-slate-400">{t.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {sheetTipo === "registrar" && (
            <>
              <SheetHeader className="mb-5">
                <SheetTitle>Registrar desperdício</SheetTitle>
                <SheetDescription>Preencha os dados da ocorrência para iniciar a trativa</SheetDescription>
              </SheetHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Insumo *</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione o insumo" /></SelectTrigger>
                    <SelectContent>
                      {["Queijo Mussarela","Farinha de Trigo","Carne Bovina","Molho de Tomate","Calabresa","Pão de Hambúrguer","Café em Grãos","Leite Integral"].map(i => (
                        <SelectItem key={i} value={i}>{i}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Quantidade perdida *</label>
                    <Input placeholder="Ex: 500g" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Data *</label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Causa *</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Selecione a causa" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(causaConfig).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Responsável</label>
                  <Input placeholder="Nome do responsável" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Descrição *</label>
                  <textarea
                    className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Descreva o que aconteceu..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">Plano de ação imediato</label>
                  <textarea
                    className="w-full min-h-[60px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder="Descreva a ação corretiva imediata (opcional)..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Prazo de resolução</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1.5 block">Prioridade</label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" /> Registrar
                  </Button>
                  <Button variant="outline" onClick={() => setSheetAberto(false)}>Cancelar</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}
