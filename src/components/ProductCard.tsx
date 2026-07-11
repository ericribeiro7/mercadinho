import { Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL, type Product } from "@/lib/products";
import { ProductThumb } from "./ProductThumb";

export function ProductCard({ product }: { product: Product }) {
  const { items, add, setQty } = useCart();
  const qty = items.find((i) => i.id === product.id)?.qty ?? 0;
  
  // Calcular desconto percentual
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div className="flex flex-col">
      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="relative block mb-3 aspect-square"
      >
        {discount && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-green-500 text-white px-2 py-1 text-xs font-bold">
            -{discount}%
          </span>
        )}
        <ProductThumb product={product} size="md" />
      </Link>

      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="text-sm font-semibold text-foreground truncate"
      >
        {product.name}
      </Link>
      
      <p className="text-xs text-muted-foreground truncate">{product.description}</p>

      <div className="mt-2 flex items-baseline gap-2">
        {product.oldPrice && (
          <span className="text-xs text-muted-foreground line-through">R$ {product.oldPrice.toFixed(2)}</span>
        )}
        <span className="text-lg font-bold text-foreground">R$ {product.price.toFixed(2)}</span>
      </div>

      <p className="text-xs text-muted-foreground mt-1">{product.unit}</p>

      <div className="mt-3">
        {qty === 0 ? (
          <button
            onClick={() => add(product.id)}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-green-600 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </button>
        ) : (
          <div className="flex h-10 w-full items-center justify-between rounded-full bg-green-100 px-1 text-green-600">
            <button
              onClick={() => setQty(product.id, qty - 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-white text-green-600 shadow-sm transition active:scale-95"
              aria-label="Diminuir"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold">{qty}</span>
            <button
              onClick={() => setQty(product.id, qty + 1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-green-600 text-white shadow-sm transition active:scale-95"
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
