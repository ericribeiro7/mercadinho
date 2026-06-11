import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, MessageCircle, Home as HomeIcon, MapPin, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/pedido-confirmado")({
  head: () => ({ meta: [{ title: "Pedido confirmado · Verdemar" }] }),
  component: ConfirmedPage,
});

type Order = {
  form: { nome: string; telefone: string; rua: string; numero: string; bairro: string; complemento: string; troco: string };
  payment: "pix" | "cartao" | "dinheiro";
  items: { name: string; qty: number; price: number }[];
  subtotal: number; fee: number; total: number;
  number: string;
};

const paymentLabel = { pix: "Pix", cartao: "Cartão na entrega", dinheiro: "Dinheiro" };

function ConfirmedPage() {
  const navigate = useNavigate();
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("last_order");
      if (!raw) { navigate({ to: "/" }); return; }
      setOrder(JSON.parse(raw));
      clear();
    } catch { navigate({ to: "/" }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) return null;

  const message = encodeURIComponent(
    `*Novo pedido ${order.number}*\n` +
    `Cliente: ${order.form.nome} (${order.form.telefone})\n` +
    `Endereço: ${order.form.rua}, ${order.form.numero} - ${order.form.bairro}` +
    (order.form.complemento ? ` (${order.form.complemento})` : "") + `\n\n` +
    order.items.map((i) => `• ${i.qty}x ${i.name} — ${formatBRL(i.price * i.qty)}`).join("\n") +
    `\n\nSubtotal: ${formatBRL(order.subtotal)}\nEntrega: ${order.fee === 0 ? "Grátis" : formatBRL(order.fee)}\n*Total: ${formatBRL(order.total)}*\n\n` +
    `Pagamento: ${paymentLabel[order.payment]}` +
    (order.payment === "dinheiro" && order.form.troco ? ` (troco para ${order.form.troco})` : "")
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;

  return (
    <div className="min-h-screen bg-surface">
      <main className="mx-auto max-w-xl px-4 py-10">
        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
            <Check className="h-8 w-8" strokeWidth={3} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Pedido enviado!</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Seu pedido <strong className="text-foreground">{order.number}</strong> foi enviado para o WhatsApp da loja. Já já confirmamos por lá.
          </p>

          <div className="mt-5 rounded-2xl bg-surface p-4 text-left">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resumo do pedido</h3>
            <ul className="space-y-1.5 text-sm">
              {order.items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3">
                  <span className="truncate"><span className="text-muted-foreground">{i.qty}x</span> {i.name}</span>
                  <span className="shrink-0 font-medium">{formatBRL(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatBRL(order.subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Entrega</span><span>{order.fee === 0 ? "Grátis" : formatBRL(order.fee)}</span></div>
              <div className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span>{formatBRL(order.total)}</span></div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-left sm:grid-cols-2">
            <InfoCard icon={<MapPin className="h-4 w-4" />} title="Entrega">
              <p>{order.form.nome}</p>
              <p className="text-muted-foreground">
                {order.form.rua}, {order.form.numero}<br />
                {order.form.bairro}{order.form.complemento ? ` · ${order.form.complemento}` : ""}
              </p>
            </InfoCard>
            <InfoCard icon={<CreditCard className="h-4 w-4" />} title="Pagamento">
              <p>{paymentLabel[order.payment]}</p>
              {order.payment === "dinheiro" && order.form.troco && (
                <p className="text-muted-foreground">Troco para {order.form.troco}</p>
              )}
            </InfoCard>
          </div>

          <div className="mt-6 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Abrir WhatsApp
            </a>
            <Link
              to="/"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card text-sm font-semibold text-foreground transition hover:bg-surface"
            >
              <HomeIcon className="h-4 w-4" /> Voltar para compras
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-sm">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}
