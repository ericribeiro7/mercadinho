import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { MapPin, Search, Leaf } from "lucide-react";
import { useEffect, useState } from "react";

export function Header({ defaultQuery = "" }: { defaultQuery?: string }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(defaultQuery);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setQ(defaultQuery), [defaultQuery]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/produtos", search: { q: q || undefined, cat: undefined } });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight">Verdemar</div>
              <div className="hidden text-[11px] text-muted-foreground sm:block">Mercado · Entrega rápida</div>
            </div>
          </Link>

          <div className="hidden min-w-0 items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">Entregar em <strong className="font-semibold text-foreground">Rua das Acácias, 120</strong></span>
          </div>
        </div>

        <form onSubmit={submit} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produtos, marcas e categorias…"
            className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary-soft"
          />
        </form>

        {pathname === "/" && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:hidden">
            <MapPin className="h-3 w-3 text-primary" />
            <span className="truncate">Entregar em <strong className="font-semibold text-foreground">Rua das Acácias, 120</strong></span>
          </div>
        )}
      </div>
    </header>
  );
}
