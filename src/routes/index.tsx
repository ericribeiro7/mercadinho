import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Truck, Clock, ShieldCheck, Leaf } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { categories, getProducts } from "@/lib/products";
import { getBanners } from "@/lib/banners";
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
    subtitle: "Rápida e segura na sua casa.",
  },
];

function Home() {
  const products = getProducts();
  const [allBanners, setAllBanners] = useState<any[]>([]);
  
  // Banners estáticos padrão
  const staticBanners = [
    {
      type: "static",
      img: banner1,
      eyebrow: "Hortifruti fresco",
      title: "Até 30% off em frutas e verduras",
      subtitle: "Seleção especial da semana, colhida hoje cedo.",
    },
    {
      type: "static",
      img: banner2,
      eyebrow: "Entrega expressa",
      title: "Receba em até 1 hora",
      subtitle: "Rápida e segura na sua casa.",
    },
  ];

  // Carregar banners do admin
  useEffect(() => {
    const adminBanners = getBanners().map((b) => ({
      type: "admin",
      id: b.id,
      img: b.image,
      eyebrow: "Promoção",
      title: b.title,
      subtitle: b.subtitle,
      products: b.products,
    }));
    
    setAllBanners([...staticBanners, ...adminBanners]);
  }, []);
  
  // Usar allBanners se houver, senão usar banners estáticos
  const banners = allBanners.length > 0 ? allBanners : staticBanners;
  
  const featured = products.slice(0, 8);

  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  return (
    <Layout>
      {/* Decorative leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <Leaf className="absolute -top-8 -left-4 w-16 h-16 text-primary/30 opacity-60 rotate-12" fill="currentColor" />
        <Leaf className="absolute top-24 -right-6 w-20 h-20 text-primary/20 opacity-50 -rotate-45" fill="currentColor" />
        <Leaf className="absolute -bottom-4 left-1/4 w-12 h-12 text-primary/25 opacity-40 rotate-6" fill="currentColor" />
        <Leaf className="absolute top-1/2 -right-3 w-14 h-14 text-primary/15 opacity-50 rotate-45" fill="currentColor" />
      </div>

      {/* Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-transparent">
        <div className="absolute inset-0 opacity-40 hidden">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {banners.map((b, i) => (
            <div key={i} className="relative w-full shrink-0">
              <div className="relative aspect-[16/9] sm:aspect-[21/8]">
                <img
                  src={b.img}
                  alt={b.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-60"
                  loading={i === 0 ? "eager" : "lazy"}
                  width={1280}
                  height={640}
                />
                <div className="relative flex h-full items-center px-5 sm:px-10">
                  <div className="max-w-md flex-1">
                    <span className="inline-block rounded-full bg-primary/20 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary mb-4">
                      {b.eyebrow}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-3">
                      <span className="text-foreground">{b.title}</span>
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-5">{b.subtitle}</p>
                    <Link
                      to="/produtos"
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
                    >
                      Ver ofertas <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Anterior"
          onClick={() => setSlide((s) => (s - 1 + banners.length) % banners.length)}
          className="absolute right-16 top-4 hidden h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:grid"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Próximo"
          onClick={() => setSlide((s) => (s + 1) % banners.length)}
          className="absolute right-4 top-4 hidden h-9 w-9 place-items-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-white sm:grid"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? "h-2 w-6 bg-primary" : "h-2 w-2 bg-primary/30"}`}
              aria-label={`Banner ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: Truck, t: "Frete grátis", s: "Por nossa conta" },
          { icon: Clock, t: "Entrega 1h", s: "Pedidos hoje" },
          { icon: ShieldCheck, t: "Compra segura", s: "Pix, cartão e dinheiro" },
        ].map(({ icon: I, t, s }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-4 text-center">
            <I className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="font-semibold text-foreground text-sm">{t}</div>
            <div className="text-muted-foreground text-xs mt-1">{s}</div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-7">
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-lg font-bold tracking-tight">Categorias</h3>
          <Link to="/produtos" className="text-xs font-semibold text-primary">Ver todas</Link>
        </div>
        <div className="relative">
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 sm:grid sm:grid-cols-8 sm:overflow-visible sm:px-0 sm:pb-1">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/produtos"
                search={{ cat: c.id, q: undefined }}
                className="flex w-20 shrink-0 flex-col items-center gap-2 transition-transform hover:scale-105 sm:w-auto"
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface text-3xl transition">
                  {c.emoji}
                </span>
                <span className="text-center text-xs font-medium text-foreground line-clamp-1">{c.name}</span>
              </Link>
            ))}
          </div>
          {/* Scroll indicator for mobile */}
          <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-12 bg-gradient-to-l from-background via-background/80 to-transparent sm:hidden" />
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
