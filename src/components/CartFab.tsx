import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export function CartFab() {
  const { count, subtotal } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (count === 0) return null;
  if (pathname.startsWith("/carrinho") || pathname.startsWith("/checkout") || pathname.startsWith("/pedido-confirmado")) return null;

  return (
    <Link
      to="/carrinho"
      className="fixed bottom-20 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background shadow-[0_10px_30px_-8px_oklch(0_0_0/0.35)] transition hover:scale-[1.02] md:bottom-6"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
        {count}
      </span>
      <span className="flex items-center gap-1.5">
        <ShoppingBag className="h-4 w-4" />
        Ver carrinho
      </span>
      <span className="h-4 w-px bg-background/30" />
      <span>{formatBRL(subtotal)}</span>
    </Link>
  );
}
