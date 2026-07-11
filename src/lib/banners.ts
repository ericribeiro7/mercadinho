export interface Banner {
  id: string;
  image: string; // Data URL
  title: string;
  subtitle: string;
  products: string[]; // IDs dos produtos em promoção
  createdAt: number;
}

// Carregar banners do localStorage
export function getBanners(): Banner[] {
  try {
    const saved = localStorage.getItem("admin_banners");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Salvar banners
export function saveBanners(banners: Banner[]): void {
  localStorage.setItem("admin_banners", JSON.stringify(banners));
}

// Adicionar banner
export function addBanner(banner: Omit<Banner, "id" | "createdAt">): Banner {
  const newBanner: Banner = {
    ...banner,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  const banners = getBanners();
  saveBanners([...banners, newBanner]);
  return newBanner;
}

// Atualizar banner
export function updateBanner(id: string, updates: Partial<Banner>): void {
  const banners = getBanners();
  const index = banners.findIndex((b) => b.id === id);
  if (index !== -1) {
    banners[index] = { ...banners[index], ...updates };
    saveBanners(banners);
  }
}

// Deletar banner
export function deleteBanner(id: string): void {
  const banners = getBanners();
  saveBanners(banners.filter((b) => b.id !== id));
}
