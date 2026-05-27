import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Boxes, Sparkles, TrendingDown, DollarSign } from "lucide-react";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="flex items-center gap-3 relative">
          <div className="h-11 w-11 rounded-2xl bg-white/15 grid place-items-center backdrop-blur">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <div className="font-semibold text-lg leading-tight tracking-tight">StockWise</div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">Smart Inventory</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Transforme estoque em lucro.
          </h1>
          <p className="text-blue-100/90">
            O ERP inteligente para restaurantes, pizzarias e cafeterias modernas. Cada grama, cada centavo, sob controle.
          </p>

          {/* Mock dashboard preview */}
          <div className="relative mt-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-white/80">Lucro do mês</div>
              <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200">+22,4%</div>
            </div>
            <div className="text-2xl font-semibold mb-3">R$ 76.480</div>
            <div className="flex items-end gap-1.5 h-16">
              {[40, 65, 50, 78, 90, 72, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-cyan-400/40 to-cyan-300/80" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              { i: TrendingDown, t: "Reduza desperdício em até 35%" },
              { i: DollarSign, t: "Margem real por produto, calculada ao grama" },
              { i: Sparkles, t: "Insights e previsões automáticas com IA" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/15 grid place-items-center backdrop-blur">
                  <f.i className="h-4 w-4" />
                </div>
                <span className="text-sm">{f.t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-blue-100/70 relative">
          “Em 2 meses identificamos R$ 3.200 de desperdício mensal. Hoje a margem dos nossos combos subiu 14%.”
          <br />— Marina, Cantina Bella
        </p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md rounded-3xl border-slate-200 shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h2>
              <p className="text-sm text-slate-500 mt-1">Bem-vindo de volta ao StockWise.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="voce@restaurante.com" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="senha">Senha</Label>
                  <a className="text-xs text-blue-600 hover:underline cursor-pointer">Esqueceu?</a>
                </div>
                <Input id="senha" type="password" placeholder="••••••••" className="bg-slate-50" />
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-11">
                <Link to="/">Entrar</Link>
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-slate-400">ou continue com</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-11">Google</Button>
                <Button variant="outline" className="h-11">Apple</Button>
              </div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Não tem conta? <a className="text-blue-600 font-medium hover:underline cursor-pointer">Comece grátis</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
