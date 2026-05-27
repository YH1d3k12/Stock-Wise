import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  Trash2,
  Pencil,
  ChefHat,
  Calculator,
} from "lucide-react";

export const Route = createFileRoute("/produtos")({ component: Produtos });

// ---- Insumos catalog (price normalized per base unit: g, ml, un) ----
// preçoBase: custo unitário na unidade base (R$ por g / ml / un)
const insumosCatalog = [
  { id: "trigo", nome: "Farinha de Trigo", base: "g", precoBase: 0.0049 }, // R$4,90/kg
  { id: "queijo", nome: "Queijo Mussarela", base: "g", precoBase: 0.0425 }, // R$42,50/kg
  { id: "molho", nome: "Molho de Tomate", base: "ml", precoBase: 0.012 }, // R$12/L
  { id: "calabresa", nome: "Calabresa", base: "g", precoBase: 0.028 },
  { id: "carne", nome: "Carne Bovina (patinho)", base: "g", precoBase: 0.0389 },
  { id: "pao", nome: "Pão de Hambúrguer", base: "un", precoBase: 1.2 },
  { id: "alface", nome: "Alface + Tomate", base: "g", precoBase: 0.015 },
  { id: "azeite", nome: "Azeite + Orégano", base: "ml", precoBase: 0.045 },
  { id: "emb_pizza", nome: "Embalagem Pizza M", base: "un", precoBase: 0.9 },
  { id: "leite", nome: "Leite Integral", base: "ml", precoBase: 0.0065 },
  { id: "cafe", nome: "Café em Grãos", base: "g", precoBase: 0.058 },
  { id: "acucar", nome: "Açúcar Refinado", base: "g", precoBase: 0.0052 },
  { id: "chocolate", nome: "Chocolate em Pó", base: "g", precoBase: 0.038 },
];

type Ingrediente = { insumoId: string; qtd: number };
type Produto = {
  nome: string;
  cat: string;
  preco: number;
  vendas: number;
  emoji: string;
  ingredientes: Ingrediente[];
};

const produtosIniciais: Produto[] = [
  {
    nome: "Pizza Calabresa",
    cat: "Pizzas",
    preco: 49.9,
    vendas: 142,
    emoji: "🍕",
    ingredientes: [
      { insumoId: "trigo", qtd: 300 },
      { insumoId: "molho", qtd: 80 },
      { insumoId: "queijo", qtd: 150 },
      { insumoId: "calabresa", qtd: 80 },
      { insumoId: "azeite", qtd: 10 },
      { insumoId: "emb_pizza", qtd: 1 },
    ],
  },
  {
    nome: "X-Burger Clássico",
    cat: "Hambúrgueres",
    preco: 28.5,
    vendas: 128,
    emoji: "🍔",
    ingredientes: [
      { insumoId: "pao", qtd: 1 },
      { insumoId: "carne", qtd: 120 },
      { insumoId: "queijo", qtd: 20 },
      { insumoId: "alface", qtd: 30 },
    ],
  },
  {
    nome: "Cappuccino",
    cat: "Bebidas",
    preco: 12.0,
    vendas: 96,
    emoji: "☕",
    ingredientes: [
      { insumoId: "cafe", qtd: 18 },
      { insumoId: "leite", qtd: 180 },
      { insumoId: "acucar", qtd: 10 },
      { insumoId: "chocolate", qtd: 5 },
    ],
  },
  {
    nome: "Pizza Margherita",
    cat: "Pizzas",
    preco: 45.0,
    vendas: 84,
    emoji: "🍕",
    ingredientes: [
      { insumoId: "trigo", qtd: 300 },
      { insumoId: "molho", qtd: 90 },
      { insumoId: "queijo", qtd: 180 },
      { insumoId: "emb_pizza", qtd: 1 },
    ],
  },
  {
    nome: "Brownie Caseiro",
    cat: "Doces",
    preco: 14.0,
    vendas: 58,
    emoji: "🍫",
    ingredientes: [
      { insumoId: "trigo", qtd: 60 },
      { insumoId: "chocolate", qtd: 40 },
      { insumoId: "acucar", qtd: 50 },
    ],
  },
  {
    nome: "Marmita Executiva",
    cat: "Marmitas",
    preco: 24.9,
    vendas: 71,
    emoji: "🍱",
    ingredientes: [
      { insumoId: "carne", qtd: 150 },
      { insumoId: "alface", qtd: 60 },
    ],
  },
];

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function calcCustoTotal(ings: Ingrediente[]) {
  return ings.reduce((sum, ing) => {
    const ins = insumosCatalog.find((i) => i.id === ing.insumoId);
    if (!ins) return sum;
    return sum + ins.precoBase * ing.qtd;
  }, 0);
}

function Produtos() {
  const [produtos, setProdutos] = useState(produtosIniciais);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [busca, setBusca] = useState("");

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const updateIngrediente = (idx: number, ingIdx: number, qtd: number) => {
    setProdutos((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              ingredientes: p.ingredientes.map((ing, j) =>
                j === ingIdx ? { ...ing, qtd } : ing,
              ),
            }
          : p,
      ),
    );
  };

  const removerIngrediente = (idx: number, ingIdx: number) => {
    setProdutos((prev) =>
      prev.map((p, i) =>
        i === idx
          ? { ...p, ingredientes: p.ingredientes.filter((_, j) => j !== ingIdx) }
          : p,
      ),
    );
  };

  const adicionarIngrediente = (idx: number, insumoId: string) => {
    setProdutos((prev) =>
      prev.map((p, i) =>
        i === idx
          ? { ...p, ingredientes: [...p.ingredientes, { insumoId, qtd: 0 }] }
          : p,
      ),
    );
  };

  const updatePreco = (idx: number, preco: number) => {
    setProdutos((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, preco } : p)),
    );
  };

  return (
    <AppLayout
      title="Produtos"
      subtitle="Cadastre seus produtos e monte a ficha técnica em tempo real"
    >
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto..."
            className="pl-9 bg-white"
          />
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtrados.map((p) => {
          const idx = produtos.indexOf(p);
          const custo = calcCustoTotal(p.ingredientes);
          const margem = p.preco > 0 ? ((p.preco - custo) / p.preco) * 100 : 0;
          return (
            <Card
              key={p.nome}
              className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 grid place-items-center text-6xl mb-3">
                  {p.emoji}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {p.nome}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1 text-[10px] bg-slate-100 text-slate-600"
                    >
                      {p.cat}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-50">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => setOpenIdx(idx)}>
                        <ChefHat className="h-4 w-4 mr-2" /> Ver ficha técnica
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOpenIdx(idx)}>
                        <Pencil className="h-4 w-4 mr-2" /> Editar ingredientes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir produto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div>
                    <p className="text-slate-500">Preço</p>
                    <p className="font-semibold text-slate-900">
                      {brl(p.preco)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Custo</p>
                    <p className="font-semibold text-slate-900">{brl(custo)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      margem >= 60
                        ? "text-emerald-600"
                        : margem >= 40
                          ? "text-amber-600"
                          : "text-red-600"
                    }`}
                  >
                    <TrendingUp className="h-3.5 w-3.5" /> {margem.toFixed(0)}% margem
                  </div>
                  <span className="text-xs text-slate-500">{p.vendas} vendas</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <FichaTecnicaSheet
        open={openIdx !== null}
        produto={openIdx !== null ? produtos[openIdx] : null}
        onClose={() => setOpenIdx(null)}
        onUpdateIngrediente={(ingIdx, qtd) =>
          openIdx !== null && updateIngrediente(openIdx, ingIdx, qtd)
        }
        onRemoverIngrediente={(ingIdx) =>
          openIdx !== null && removerIngrediente(openIdx, ingIdx)
        }
        onAdicionarIngrediente={(insumoId) =>
          openIdx !== null && adicionarIngrediente(openIdx, insumoId)
        }
        onUpdatePreco={(preco) => openIdx !== null && updatePreco(openIdx, preco)}
      />
    </AppLayout>
  );
}

function FichaTecnicaSheet({
  open,
  produto,
  onClose,
  onUpdateIngrediente,
  onRemoverIngrediente,
  onAdicionarIngrediente,
  onUpdatePreco,
}: {
  open: boolean;
  produto: Produto | null;
  onClose: () => void;
  onUpdateIngrediente: (ingIdx: number, qtd: number) => void;
  onRemoverIngrediente: (ingIdx: number) => void;
  onAdicionarIngrediente: (insumoId: string) => void;
  onUpdatePreco: (preco: number) => void;
}) {
  const [novoInsumo, setNovoInsumo] = useState<string>("");

  const calc = useMemo(() => {
    if (!produto) return { custo: 0, cmv: 0, lucro: 0, margem: 0 };
    const custo = calcCustoTotal(produto.ingredientes);
    const cmv = produto.preco > 0 ? (custo / produto.preco) * 100 : 0;
    const lucro = produto.preco - custo;
    const margem = produto.preco > 0 ? (lucro / produto.preco) * 100 : 0;
    return { custo, cmv, lucro, margem };
  }, [produto]);

  const disponiveis = produto
    ? insumosCatalog.filter(
        (i) => !produto.ingredientes.some((ing) => ing.insumoId === i.id),
      )
    : [];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0 flex flex-col">
        {produto && (
          <>
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 grid place-items-center text-3xl shadow-sm">
                  {produto.emoji}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <SheetTitle className="text-lg">{produto.nome}</SheetTitle>
                  <SheetDescription className="text-xs">
                    Ficha técnica · cálculo automático em tempo real
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Preço de venda */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500">
                    Preço de venda
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      R$
                    </span>
                    <Input
                      type="number"
                      step="0.10"
                      value={produto.preco}
                      onChange={(e) =>
                        onUpdatePreco(parseFloat(e.target.value) || 0)
                      }
                      className="pl-9 font-semibold"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-500">
                    Categoria
                  </label>
                  <Input
                    value={produto.cat}
                    readOnly
                    className="mt-1 bg-slate-50 text-slate-600"
                  />
                </div>
              </div>

              {/* Lista de ingredientes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    Ingredientes
                  </h4>
                  <span className="text-xs text-slate-500">
                    {produto.ingredientes.length} itens
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="grid grid-cols-[1fr_90px_90px_32px] gap-2 px-3 py-2 bg-slate-50 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                    <div>Insumo</div>
                    <div>Quantidade</div>
                    <div className="text-right">Custo</div>
                    <div />
                  </div>

                  {produto.ingredientes.map((ing, idx) => {
                    const ins = insumosCatalog.find((i) => i.id === ing.insumoId);
                    if (!ins) return null;
                    const custoParcial = ins.precoBase * ing.qtd;
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center px-3 py-2.5 border-t border-slate-100 hover:bg-slate-50/60"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {ins.nome}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {brl(ins.precoBase)}/{ins.base}
                          </p>
                        </div>
                        <div className="relative">
                          <Input
                            type="number"
                            value={ing.qtd}
                            onChange={(e) =>
                              onUpdateIngrediente(
                                idx,
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="h-8 pr-7 text-sm"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                            {ins.base}
                          </span>
                        </div>
                        <div className="text-right text-sm font-semibold text-slate-800">
                          {brl(custoParcial)}
                        </div>
                        <button
                          onClick={() => onRemoverIngrediente(idx)}
                          className="text-slate-300 hover:text-red-500 grid place-items-center"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Adicionar */}
                  <div className="border-t border-slate-100 p-2.5 bg-slate-50/40 flex gap-2">
                    <select
                      value={novoInsumo}
                      onChange={(e) => setNovoInsumo(e.target.value)}
                      className="flex-1 h-8 text-sm rounded-md border border-slate-200 bg-white px-2 text-slate-700"
                    >
                      <option value="">+ Adicionar insumo...</option>
                      {disponiveis.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.nome} ({brl(i.precoBase)}/{i.base})
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 h-8"
                      disabled={!novoInsumo}
                      onClick={() => {
                        if (novoInsumo) {
                          onAdicionarIngrediente(novoInsumo);
                          setNovoInsumo("");
                        }
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Resumo */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-4 w-4 text-emerald-300" />
                  <span className="text-xs uppercase tracking-widest text-slate-300 font-medium">
                    Resumo automático
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-300">Custo total</span>
                    <span className="font-semibold">{brl(calc.custo)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-300">Preço de venda</span>
                    <span className="font-semibold">{brl(produto.preco)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-300">CMV</span>
                    <span
                      className={`font-semibold ${
                        calc.cmv > 40 ? "text-amber-300" : "text-emerald-300"
                      }`}
                    >
                      {calc.cmv.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-300">Margem</span>
                    <span
                      className={`font-semibold ${
                        calc.margem >= 60
                          ? "text-emerald-300"
                          : calc.margem >= 40
                            ? "text-amber-300"
                            : "text-red-300"
                      }`}
                    >
                      {calc.margem.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-slate-300">Lucro bruto / un</span>
                  <span className="text-2xl font-bold text-emerald-300">
                    {brl(calc.lucro)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex gap-2 bg-white">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Fechar
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={onClose}
              >
                Salvar ficha
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
