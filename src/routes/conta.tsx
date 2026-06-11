import { createFileRoute, Link } from "@tanstack/react-router";
import { User, MapPin, Receipt, Heart, HelpCircle, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta · Verdemar" }] }),
  component: AccountPage,
});

function AccountPage() {
  const items = [
    { icon: Receipt, label: "Meus pedidos", desc: "Acompanhe entregas e histórico" },
    { icon: MapPin, label: "Endereços", desc: "Gerencie locais de entrega" },
    { icon: Heart, label: "Favoritos", desc: "Seus produtos preferidos" },
    { icon: HelpCircle, label: "Ajuda", desc: "Fale com a gente" },
  ];
  return (
    <Layout>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft text-accent-foreground">
          <User className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">Olá, visitante</div>
          <div className="text-xs text-muted-foreground">Faça login para acompanhar seus pedidos</div>
        </div>
        <Link to="/" className="ml-auto rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">Entrar</Link>
      </div>

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {items.map(({ icon: I, label, desc }) => (
          <li key={label}>
            <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-surface">
              <I className="h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{label}</div>
                <div className="truncate text-xs text-muted-foreground">{desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
