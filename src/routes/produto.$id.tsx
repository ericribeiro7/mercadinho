import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Truck, Clock } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProductThumb } from "@/components/ProductThumb";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/cart";
import { formatBRL, getProduct, products } from "@/lib/products";

export const Route = createFileRoute("/produto/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.name} · Verdemar` : "Produto · Verdemar" },
        { name: "description", content: p?.description ?? "Detalhes do produto" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const product = getProduct(id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
          <Link to="/produtos" className="mt-3 inline-block text-sm font-semibold text-primary">Voltar à loja</Link>
        </main>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const total = product.price * qty;

  return (
    <div className="min-h-screen bg-background pb-32 md:pb-12">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-5">
        <button
          onClick={() => navigate({ to: "/produtos" })}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
              {product.tag && (
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    product.tag === "promo"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {product.tag === "promo" ? "Promoção" : "Novo"}
                </span>
              )}
              <button
                aria-label="Favoritar"
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card text-muted-foreground shadow-[var(--shadow-soft)] transition hover:text-foreground"
              >
                <Heart className="h-4 w-4" />
              </button>
              <ProductThumb product={product} size="xl" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-xl border ${
                    i === 0 ? "border-foreground" : "border-border"
                  } bg-card text-2xl`}
                  style={i === 0 ? { backgroundColor: product.tint } : undefined}
                >
                  {product.emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              {product.category}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatBRL(product.price)}</span>
              {product.oldPrice && (
                <span className="text-base text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
              )}
              <span className="text-xs text-muted-foreground">/ {product.unit}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-2xl bg-surface p-3">
                <Truck className="h-4 w-4 text-primary" />
                <div className="text-[11px] leading-tight">
                  <div className="font-semibold">Entrega rápida</div>
                  <div className="text-muted-foreground">Em até 1 hora</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-surface p-3">
                <Clock className="h-4 w-4 text-primary" />
                <div className="text-[11px] leading-tight">
                  <div className="font-semibold">Frescor garantido</div>
                  <div className="text-muted-foreground">Selecionado hoje</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Descrição</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.name} de alta qualidade, selecionado a dedo pela nossa equipe.
                Ideal para o dia a dia da sua família, com sabor fresco e procedência confiável.
              </p>
            </div>

            {/* Desktop add-to-cart */}
            <div className="mt-6 hidden items-center gap-3 md:flex">
              <div className="flex h-12 items-center gap-1 rounded-full border border-border bg-card px-1">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => { add(product.id, qty); navigate({ to: "/carrinho" }); }}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <ShoppingBag className="h-4 w-4" />
                Adicionar · {formatBRL(total)}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h3 className="mb-3 text-lg font-bold tracking-tight">Você também pode gostar</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>

      {/* Mobile add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-12 items-center gap-1 rounded-full border border-border bg-card px-1">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center rounded-full">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => { add(product.id, qty); navigate({ to: "/carrinho" }); }}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            Adicionar · {formatBRL(total)}
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
