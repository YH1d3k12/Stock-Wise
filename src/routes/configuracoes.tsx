import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Building2, Bell, Percent, CreditCard } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({ component: Config });

function Config() {
  return (
    <AppLayout title="Configurações" subtitle="Personalize o StockWise para o seu negócio">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-blue-600" /> Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Razão social</Label>
              <Input defaultValue="Cantina Bella Ltda" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">CNPJ</Label>
                <Input defaultValue="12.345.678/0001-90" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Segmento</Label>
                <Input defaultValue="Pizzaria & Cafeteria" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Endereço</Label>
              <Input defaultValue="Rua das Acácias, 234 — São Paulo/SP" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Percent className="h-4 w-4 text-emerald-600" /> Precificação padrão</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Margem alvo (%)</Label>
                <Input type="number" defaultValue="35" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Taxa iFood (%)</Label>
                <Input type="number" defaultValue="12" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Embalagem média</Label>
                <Input defaultValue="R$ 1,80" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Energia/gás por venda</Label>
                <Input defaultValue="R$ 0,90" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-amber-600" /> Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              ["Estoque crítico", "Avisar quando insumo cair abaixo do mínimo", true],
              ["Margem em queda", "Alertar quando produto perder margem", true],
              ["Aumento de custo de insumo", "Notificar reajuste acima de 5%", true],
              ["Resumo diário por e-mail", "Enviar relatório do dia às 22h", false],
            ].map(([t, d, v]: any) => (
              <div key={t} className="flex items-center justify-between py-3 border-b last:border-0 border-slate-100">
                <div>
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-slate-500">{d}</div>
                </div>
                <Switch defaultChecked={v} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4 text-indigo-600" /> Plano e faturamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-600 font-medium uppercase tracking-wider">Plano atual</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">StockWise Pro</div>
                  <div className="text-xs text-slate-600 mt-0.5">Renova em 14/06/2026 · R$ 189,00/mês</div>
                </div>
                <Button variant="outline" className="bg-white">Gerenciar</Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="text-xs text-slate-500">Próxima fatura: <span className="font-medium text-slate-700">R$ 189,00 em 14/06/2026</span></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button className="bg-blue-600 hover:bg-blue-700">Salvar alterações</Button>
      </div>
    </AppLayout>
  );
}
