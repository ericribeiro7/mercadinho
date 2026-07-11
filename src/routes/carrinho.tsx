import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductThumb } from "@/components/ProductThumb";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho · Verdemar" }] }),
  component: CartPage,
});

const DELIVERY_FEE = 7.9;
const FREE_THRESHOLD = 99;

function CartPage() {
  const { detailed, subtotal, setQty, remove, count } = useCart();

  const fee = subtotal >= FREE_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal + fee);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      <Header hideSearch={true} />
      <main className="mx-auto max-w-4xl px-4 py-5">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate({ to: "/produtos" })} className="rounded-full p-2 hover:bg-surface transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Seu carrinho</h1>
        </div>
        <p className="text-xs text-muted-foreground">{count} {count === 1 ? "item" : "itens"}</p>

        {detailed.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-card text-muted-foreground">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-semibold">Seu carrinho está vazio</p>
            <p className="text-xs text-muted-foreground">Adicione produtos para continuar.</p>
            <Link to="/produtos" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Explorar produtos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_360px]">
            <ul className="space-y-3">
              {detailed.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
                  <div className="w-20 shrink-0">
                    <ProductThumb product={product} size="sm" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{product.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{product.description}</div>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-destructive"
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full bg-surface p-1">
                        <button onClick={() => setQty(product.id, qty - 1)} className="grid h-7 w-7 place-items-center rounded-full bg-card shadow-[var(--shadow-soft)]" aria-label="Diminuir">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)} className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Aumentar">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-sm font-bold">{formatBRL(product.price * qty)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={formatBRL(subtotal)} />
                  <Row label="Taxa de entrega" value={fee === 0 ? <span className="text-primary font-semibold">Grátis</span> : formatBRL(fee)} />
                </div>
                <div className="my-3 h-px bg-border" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">{formatBRL(total)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  Continuar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
