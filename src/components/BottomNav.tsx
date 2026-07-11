import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();

  const items = [
    { to: "/" as const, label: "Início", icon: Home },
    { to: "/produtos" as const, label: "Categorias", icon: LayoutGrid },
    { to: "/carrinho" as const, label: "Carrinho", icon: ShoppingBag, badge: count },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <ul className="mx-auto grid grid-cols-3">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const active = pathname === to || (to !== "/" && pathname.startsWith(to));
          return (
            <li key={to}>
              <Link
                to={to}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
                  {badge ? (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {badge}
                    </span>
                  ) : null}
                </span>
                <span className={active ? "font-semibold" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
