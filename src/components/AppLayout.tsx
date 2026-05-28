import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Boxes,
  FileBarChart2,
  Sparkles,
  ChefHat,
  Bell,
  Search,
  Settings,
  LogOut,
  Warehouse,
  Receipt,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Recycle,
  Tag,
  Brain,
  Check,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/produtos", label: "Produtos", icon: ChefHat },
  { to: "/estoque", label: "Estoque & Insumos", icon: Warehouse },
  { to: "/vendas", label: "Vendas", icon: Receipt },
  { to: "/desperdicios", label: "Desperdícios", icon: Recycle },
  { to: "/ia", label: "Inteligência", icon: Sparkles },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

const onboardingSteps = [
  { icon: Boxes, title: "Bem-vindo ao StockWise", text: "Controle estoque, custos e lucro em tempo real." },
  { icon: TrendingUp, title: "Entenda o lucro real", text: "Descubra exatamente quanto cada produto gera de lucro." },
  { icon: Recycle, title: "Controle desperdícios", text: "Identifique perdas, consumo excessivo e estoque parado." },
  { icon: Tag, title: "Precificação inteligente", text: "O sistema sugere preços ideais automaticamente." },
  { icon: Brain, title: "Inteligência operacional", text: "Receba alertas inteligentes e previsões de reposição." },
];

function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const total = onboardingSteps.length;
  const s = onboardingSteps[step];
  const Icon = s.icon;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm grid place-items-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto">
        <div className="grid md:grid-cols-2">
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-10 text-white flex flex-col justify-between gap-6 md:min-h-[420px]">
            <div className="flex items-center gap-2">
              <div className="grid place-items-center h-9 w-9 rounded-xl bg-white/15 backdrop-blur">
                <Boxes className="h-5 w-5" />
              </div>
              <span className="font-semibold tracking-tight">StockWise</span>
            </div>
            <div className="relative flex justify-center md:justify-start">
              <div className="absolute -top-8 -left-4 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="relative grid place-items-center h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 shadow-xl">
                <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
            <div className="flex gap-1.5 justify-center md:justify-start">
              {onboardingSteps.map((_, i) => (
                <div key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-8 bg-white" : "w-1.5 bg-white/30")} />
              ))}
            </div>
          </div>
          <div className="p-6 sm:p-10 flex flex-col">
            <p className="text-xs font-medium text-blue-600 tracking-widest uppercase">Passo {step + 1} de {total}</p>
            <h2 className="mt-3 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">{s.title}</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.text}</p>
            <div className="mt-auto pt-8 flex items-center justify-between gap-3">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)} className="text-slate-600">
                <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
              </Button>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">Pular</button>
                {step < total - 1 ? (
                  <Button onClick={() => setStep(step + 1)} className="bg-blue-600 hover:bg-blue-700">
                    Próximo <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                    <Check className="h-4 w-4 mr-1" /> Começar agora
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm shadow-blue-600/20">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold leading-tight tracking-tight">StockWise</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
            Smart Inventory
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
              MR
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Marina Rossi</div>
            <div className="text-[10px] text-slate-500 truncate">
              Cantina Bella · Plano Pro
            </div>
          </div>
          <Link
            to="/login"
            onClick={onNavigate}
            className="text-slate-400 hover:text-slate-600"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}

export function AppLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { pathname } = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("stockwise_onboarded")) setShowOnboarding(true);
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem("stockwise_onboarded", "1");
    setShowOnboarding(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <SidebarNav pathname={pathname} />
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 max-w-[85vw] flex flex-col [&>button]:hidden"
        >
          <div className="absolute right-3 top-3 z-10">
            <button
              onClick={() => setMobileOpen(false)}
              className="grid place-items-center h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-2 md:gap-4 px-3 md:px-8 py-3 md:py-4 border-b border-slate-200 bg-white/95 backdrop-blur">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden grid place-items-center h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shrink-0"
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4 text-slate-700" />
          </button>

          <div className="md:hidden flex items-center gap-2 shrink-0">
            <div className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <Boxes className="h-4 w-4" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="hidden sm:block text-xs md:text-sm text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="hidden lg:flex relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar produtos, insumos..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
          <button className="relative grid place-items-center h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shrink-0">
            <Bell className="h-4 w-4 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
              MR
            </AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-8 min-w-0">{children}</main>
      </div>

      {showOnboarding && <Onboarding onClose={closeOnboarding} />}
    </div>
  );
}
