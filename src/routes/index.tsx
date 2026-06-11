import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Truck, Clock, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/lib/products";
import banner1 from "@/assets/banner-1.jpg";
import banner2 from "@/assets/banner-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdemar · Mercado com entrega rápida" },
      { name: "description", content: "Frutas, verduras, padaria e mercearia entregues na sua porta em até 1h." },
      { property: "og:title", content: "Verdemar · Mercado delivery" },
      { property: "og:description", content: "Faça suas compras de mercado e receba em até 1h." },
    ],
  }),
  component: Home,
});

const banners = [
  {
    img: banner1,
    eyebrow: "Hortifruti fresco",
    title: "Até 30% off em frutas e verduras",
    subtitle: "Seleção especial da semana, colhida hoje cedo.",
  },
  {
    img: banner2,
    eyebrow: "Entrega expressa",
    title: "Receba em até 1 hora",
    subtitle: "Sem taxa em pedidos acima de R$ 99.",
  },
];

function Home() {
  const promos = products.filter((p) => p.tag === "promo");
  const featured = products.slice(0, 8);

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Layout>
      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {banners.map((b, i) => (
            <div key={i} className="relative w-full shrink-0">
              <div className="relative aspect-[16/9] sm:aspect-[21/8]">
                <img
                  src={b.img}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  width={1280}
                  height={640}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
                <div className="relative flex h-full max-w-md flex-col justify-center gap-2 p-5 sm:p-10">
                  <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                    {b.eyebrow}
                  </span>
                  <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                    {b.title}
                  </h2>
                  <p className="text-sm text-muted-foreground sm:text-base">{b.subtitle}</p>
                  <Link
                    to="/produtos"
                    className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    Ver ofertas <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Anterior"
          onClick={() => setSlide((s) => (s - 1 + banners.length) % banners.length)}
          className="absolute right-14 top-3 hidden h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-card sm:grid"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Próximo"
          onClick={() => setSlide((s) => (s + 1) % banners.length)}
          className="absolute right-3 top-3 hidden h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition hover:bg-card sm:grid"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all ${i === slide ? "w-6 bg-primary" : "w-1.5 bg-foreground/30"}`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-card p-3 text-center text-[11px] sm:text-xs">
        {[
          { icon: Truck, t: "Frete grátis", s: "Acima de R$ 99" },
          { icon: Clock, t: "Entrega 1h", s: "Pedidos hoje" },
          { icon: ShieldCheck, t: "Compra segura", s: "Pix, cartão e dinheiro" },
        ].map(({ icon: I, t, s }) => (
          <div key={t} className="flex flex-col items-center gap-1 px-1">
            <I className="h-4 w-4 text-primary" />
            <div className="font-semibold text-foreground">{t}</div>
            <div className="text-muted-foreground">{s}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-lg font-bold tracking-tight">Categorias</h3>
          <Link to="/produtos" className="text-xs font-semibold text-primary">Ver todas</Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:grid sm:grid-cols-8 sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ cat: c.id, q: undefined }}
              className="flex w-20 shrink-0 flex-col items-center gap-2 sm:w-auto"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface text-3xl transition group-hover:scale-105">
                {c.emoji}
              </span>
              <span className="text-center text-xs font-medium text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promos */}
      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Ofertas da semana</h3>
            <p className="text-xs text-muted-foreground">Promoções válidas enquanto durarem os estoques.</p>
          </div>
          <Link to="/produtos" className="text-xs font-semibold text-primary">Ver tudo</Link>
        </div>
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {promos.map((p) => (
            <div key={p.id} className="w-44 shrink-0 sm:w-auto">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-lg font-bold tracking-tight">Em destaque</h3>
          <Link to="/produtos" className="text-xs font-semibold text-primary">Ver mais</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
