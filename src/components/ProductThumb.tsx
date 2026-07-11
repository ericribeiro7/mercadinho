import type { Product } from "@/lib/products";

export function ProductThumb({ product, size = "md" }: { product: Product; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "h-16 w-16 text-3xl",
    md: "h-full w-full text-5xl",
    lg: "h-40 w-full text-6xl",
    xl: "h-72 w-full text-[8rem]",
  };
  return (
    <div
      className={`flex items-center justify-center rounded-2xl overflow-hidden ${sizes[size]}`}
      style={{ backgroundColor: product.tint }}
      aria-hidden
    >
      {product.image ? (
        <img src={product.image} alt={product.name} className="h-3/4 w-3/4 object-contain" />
      ) : (
        <span>{product.emoji}</span>
      )}
    </div>
  );
}
