import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Banknote, QrCode, MapPin, User } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Verdemar" }] }),
  component: CheckoutPage,
});

type Payment = "pix" | "cartao" | "dinheiro";

const DELIVERY_FEE = 7.9;
const FREE_THRESHOLD = 99;

function CheckoutPage() {
  const navigate = useNavigate();
  const { subtotal, detailed } = useCart();
  const fee = subtotal >= FREE_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + fee;

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    troco: "",
  });
  const [payment, setPayment] = useState<Payment>("pix");

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(
        "last_order",
        JSON.stringify({
          form,
          payment,
          items: detailed.map((d) => ({ name: d.product.name, qty: d.qty, price: d.product.price })),
          subtotal, fee, total,
          number: "VM" + Math.floor(1000 + Math.random() * 9000),
        })
      );
    } catch {}
    navigate({ to: "/pedido-confirmado" });
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-12">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-5">
        <button
          onClick={() => navigate({ to: "/carrinho" })}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao carrinho
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Finalizar pedido</h1>
        <p className="text-xs text-muted-foreground">Preencha os dados para entrega.</p>

        <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section icon={<User className="h-4 w-4" />} title="Contato">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nome completo" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Como devemos chamar?" required />
                <Field label="Telefone" value={form.telefone} onChange={(v) => update("telefone", v)} placeholder="(11) 99999-9999" required />
              </div>
            </Section>

            <Section icon={<MapPin className="h-4 w-4" />} title="Endereço de entrega">
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <Field label="Rua" value={form.rua} onChange={(v) => update("rua", v)} placeholder="Nome da rua" required />
                <Field label="Número" value={form.numero} onChange={(v) => update("numero", v)} placeholder="123" required />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Bairro" value={form.bairro} onChange={(v) => update("bairro", v)} placeholder="Seu bairro" required />
                <Field label="Complemento" value={form.complemento} onChange={(v) => update("complemento", v)} placeholder="Apto, bloco (opcional)" />
              </div>
            </Section>

            <Section icon={<CreditCard className="h-4 w-4" />} title="Forma de pagamento">
              <div className="grid grid-cols-3 gap-2">
                <PayOption active={payment === "pix"} onClick={() => setPayment("pix")} icon={<QrCode className="h-5 w-5" />} label="Pix" />
                <PayOption active={payment === "cartao"} onClick={() => setPayment("cartao")} icon={<CreditCard className="h-5 w-5" />} label="Cartão" />
                <PayOption active={payment === "dinheiro"} onClick={() => setPayment("dinheiro")} icon={<Banknote className="h-5 w-5" />} label="Dinheiro" />
              </div>

              {payment === "dinheiro" && (
                <div className="mt-3">
                  <Field
                    label="Troco para quanto?"
                    value={form.troco}
                    onChange={(v) => update("troco", v)}
                    placeholder="Ex: R$ 100,00 (deixe vazio se não precisa)"
                  />
                </div>
              )}
              {payment === "pix" && (
                <p className="mt-3 rounded-xl bg-surface p-3 text-[11px] text-muted-foreground">
                  Você receberá o QR Code do Pix no WhatsApp após confirmar o pedido.
                </p>
              )}
              {payment === "cartao" && (
                <p className="mt-3 rounded-xl bg-surface p-3 text-[11px] text-muted-foreground">
                  Pagamento na maquininha no momento da entrega.
                </p>
              )}
            </Section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">Resumo</h3>
              <div className="mt-3 space-y-1.5 text-sm">
                <Row label={`Subtotal (${detailed.length} itens)`} value={formatBRL(subtotal)} />
                <Row label="Taxa de entrega" value={fee === 0 ? <span className="font-semibold text-primary">Grátis</span> : formatBRL(fee)} />
              </div>
              <div className="my-3 h-px bg-border" />
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold">{formatBRL(total)}</span>
              </div>
              <button
                type="submit"
                className="mt-4 hidden h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 md:flex"
              >
                Confirmar pedido
              </button>
            </div>
          </aside>

          {/* Mobile sticky CTA */}
          <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
            <div className="mb-1 flex items-baseline justify-between px-2 text-xs">
              <span className="text-muted-foreground">Total</span>
              <span className="text-base font-bold">{formatBRL(total)}</span>
            </div>
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              Confirmar pedido
            </button>
          </div>
        </form>
      </main>
      <BottomNav />
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-accent-foreground">{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({
  label, value, onChange, placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary-soft"
      />
    </label>
  );
}

function PayOption({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-xs font-semibold transition ${
        active
          ? "border-primary bg-primary-soft text-accent-foreground ring-4 ring-primary-soft"
          : "border-border bg-card text-foreground hover:border-foreground/30"
      }`}
    >
      {icon}
      {label}
    </button>
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
