import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { CartFab } from "./CartFab";

export function Layout({ children, query }: { children: ReactNode; query?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 via-primary/15 to-background pb-24 md:pb-12">
      <Header defaultQuery={query} />
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
      <CartFab />
      <BottomNav />
    </div>
  );
}
