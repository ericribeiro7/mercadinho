import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, type Product } from "@/lib/products";
import { ProductThumb } from "./ProductThumb";

export function ProductCard({ product }: { product: Product }) {
  const { items, add, setQty } = useCart();
  const qty = items.find((i) => i.id === product.id)?.qty ?? 0;

  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)]">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative block"
      >
        {product.tag && (
          <span
            className={`absolute left-1 top-1 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              product.tag === "promo"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {product.tag === "promo" ? "Promo" : "Novo"}
          </span>
        )}
        <ProductThumb product={product} size="md" />
      </Link>

      <div className="mt-3 flex min-w-0 flex-col gap-0.5">
        <Link
          to="/produto/$id"
          params={{ id: product.id }}
          className="truncate text-sm font-semibold text-foreground"
        >
          {product.name}
        </Link>
        <p className="truncate text-xs text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-base font-bold text-foreground">{formatBRL(product.price)}</span>
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
        )}
      </div>

      <div className="mt-3">
        {qty === 0 ? (
          <button
            onClick={() => add(product.id)}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        ) : (
          <div className="flex h-10 w-full items-center justify-between rounded-full bg-primary-soft px-1 text-primary">
            <button
              onClick={() => setQty(product.id, qty - 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-card text-foreground shadow-[var(--shadow-soft)] transition active:scale-95"
              aria-label="Diminuir"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-accent-foreground">{qty}</span>
            <button
              onClick={() => setQty(product.id, qty + 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition active:scale-95"
              aria-label="Aumentar"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
