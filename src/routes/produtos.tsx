import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";

const search = z.object({
  cat: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/produtos")({
  validateSearch: (s) => search.parse(s),
  head: () => ({
    meta: [
      { title: "Produtos · Verdemar" },
      { name: "description", content: "Explore frutas, verduras, padaria, bebidas e mais." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { cat, q } = Route.useSearch();
  const activeCat = cat ?? "all";
  const query = (q ?? "").toLowerCase().trim();

  const filtered = products.filter((p) => {
    if (activeCat !== "all" && p.category !== activeCat) return false;
    if (query && !`${p.name} ${p.description}`.toLowerCase().includes(query)) return false;
    return true;
  });

  const currentCat = categories.find((c) => c.id === activeCat);

  return (
    <Layout query={q}>
      <div className="mb-2 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Resultados para "${q}"` : currentCat ? currentCat.name : "Todos os produtos"}
        </h1>
        <span className="text-xs text-muted-foreground">{filtered.length} itens</span>
      </div>

      <div className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link
          to="/produtos"
          search={{ cat: undefined, q: q || undefined }}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
            activeCat === "all"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-card text-foreground hover:border-foreground/30"
          }`}
        >
          Todos
        </Link>
        {categories.map((c) => {
          const active = activeCat === c.id;
          return (
            <Link
              key={c.id}
              to="/produtos"
              search={{ cat: c.id, q: q || undefined }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-foreground hover:border-foreground/30"
              }`}
            >
              <span>{c.emoji}</span> {c.name}
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface py-16 text-center">
          <div className="text-3xl">🔎</div>
          <p className="mt-2 text-sm font-semibold">Nenhum produto encontrado</p>
          <p className="text-xs text-muted-foreground">Tente outra busca ou categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Layout>
  );
}
