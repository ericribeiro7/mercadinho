export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  unit: string;
  category: string;
  emoji: string;
  tint: string;
  tag?: "promo" | "novo";
  image?: string;
};

export const categories = [
  { id: "frutas", name: "Frutas", emoji: "🍎" },
  { id: "verduras", name: "Verduras", emoji: "🥬" },
  { id: "carnes", name: "Carnes", emoji: "🥩" },
  { id: "padaria", name: "Padaria", emoji: "🥖" },
  { id: "laticinios", name: "Laticínios", emoji: "🥛" },
  { id: "bebidas", name: "Bebidas", emoji: "🧃" },
  { id: "mercearia", name: "Mercearia", emoji: "🍚" },
  { id: "limpeza", name: "Limpeza", emoji: "🧴" },
];

const defaultProducts: Product[] = [
  { id: "1", name: "Maçã Gala", description: "Bandeja com 6 unidades", price: 9.9, oldPrice: 12.9, unit: "bandeja", category: "frutas", emoji: "🍎", tint: "#fdecec", tag: "promo" },
  { id: "2", name: "Banana Prata", description: "Cacho aprox. 1kg", price: 6.49, unit: "kg", category: "frutas", emoji: "🍌", tint: "#fdf7e2" },
  { id: "3", name: "Abacate", description: "Unidade selecionada", price: 4.99, unit: "un", category: "frutas", emoji: "🥑", tint: "#eef6e6" },
  { id: "4", name: "Alface Crespa", description: "Maço fresco", price: 3.49, unit: "maço", category: "verduras", emoji: "🥬", tint: "#ecf6ec" },
  { id: "5", name: "Tomate Italiano", description: "Selecionado, por kg", price: 7.9, oldPrice: 9.5, unit: "kg", category: "verduras", emoji: "🍅", tint: "#fdecec", tag: "promo" },
  { id: "6", name: "Brócolis", description: "Cabeça média", price: 5.49, unit: "un", category: "verduras", emoji: "🥦", tint: "#ecf6ec" },
  { id: "7", name: "Pão Francês", description: "500g fresquinho", price: 8.9, unit: "500g", category: "padaria", emoji: "🥖", tint: "#fbf1de" },
  { id: "8", name: "Croissant", description: "Manteiga francesa", price: 4.5, unit: "un", category: "padaria", emoji: "🥐", tint: "#fbf1de", tag: "novo" },
  { id: "9", name: "Leite Integral", description: "1L caixa", price: 5.29, unit: "1L", category: "laticinios", emoji: "🥛", tint: "#eef2fb" },
  { id: "10", name: "Queijo Mussarela", description: "Fatiado 200g", price: 14.9, oldPrice: 17.9, unit: "200g", category: "laticinios", emoji: "🧀", tint: "#fdf7e2", tag: "promo" },
  { id: "11", name: "Suco de Laranja", description: "Natural 1L", price: 11.9, unit: "1L", category: "bebidas", emoji: "🧃", tint: "#fef0df" },
  { id: "12", name: "Água Mineral", description: "Garrafa 1,5L", price: 2.99, unit: "1,5L", category: "bebidas", emoji: "💧", tint: "#eaf4fb" },
  { id: "13", name: "Arroz Tipo 1", description: "Pacote 5kg", price: 27.9, oldPrice: 32.9, unit: "5kg", category: "mercearia", emoji: "🍚", tint: "#f4efe6", tag: "promo" },
  { id: "14", name: "Feijão Carioca", description: "Pacote 1kg", price: 8.49, unit: "1kg", category: "mercearia", emoji: "🫘", tint: "#f1e8db" },
  { id: "15", name: "Picanha Bovina", description: "Peça resfriada", price: 79.9, unit: "kg", category: "carnes", emoji: "🥩", tint: "#fbe6e6" },
  { id: "16", name: "Frango Inteiro", description: "Resfriado aprox. 2kg", price: 24.9, unit: "kg", category: "carnes", emoji: "🍗", tint: "#fbeede" },
  { id: "17", name: "Detergente", description: "Neutro 500ml", price: 3.29, unit: "500ml", category: "limpeza", emoji: "🧴", tint: "#eaf4fb" },
  { id: "18", name: "Sabão em Pó", description: "Caixa 1kg", price: 16.9, oldPrice: 19.9, unit: "1kg", category: "limpeza", emoji: "🧺", tint: "#eef2fb", tag: "promo" },
];

export function getProducts(): Product[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultProducts;
      }
    }
  }
  return defaultProducts;
}

export const products: Product[] = getProducts();

export const getProduct = (id: string) => getProducts().find((p) => p.id === id);
export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
