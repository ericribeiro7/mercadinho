import { useState } from "react";
import { Trash2, Edit2, Plus, X, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/products";
import type { Banner } from "@/lib/banners";

interface BannerManagerProps {
  banners: Banner[];
  onSave: (banner: Banner) => void;
  onDelete: (id: string) => void;
  products: Product[];
}

export function BannerManager({ banners, onSave, onDelete, products }: BannerManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    image: "",
    title: "",
    subtitle: "",
    products: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image || !form.title || !form.subtitle) {
      alert("Preencha todos os campos");
      return;
    }

    const banner: Banner = {
      id: editingId || Date.now().toString(),
      ...form,
      createdAt: Date.now(),
    };

    onSave(banner);
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setForm({
      image: "",
      title: "",
      subtitle: "",
      products: [],
    });
    setEditingId(null);
  };

  const handleEdit = (banner: Banner) => {
    setForm({
      image: banner.image,
      title: banner.title,
      subtitle: banner.subtitle,
      products: banner.products,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const toggleProduct = (productId: string) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(productId)
        ? f.products.filter((id) => id !== productId)
        : [...f.products, productId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Gerenciar Banners</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Crie e edite banners personalizados para o carrossel
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Banner
          </Button>
        )}
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {editingId ? "Editar Banner" : "Novo Banner"}
            </h3>
            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="rounded-full p-2 hover:bg-surface transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Upload de Imagem */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Imagem *</label>
              <div className="mt-2 flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setForm({ ...form, image: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-sm file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-2 file:cursor-pointer file:text-xs file:font-semibold hover:file:opacity-90 transition"
                  />
                </div>
                {form.image && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Título */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Título *</label>
              <Input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Grande liquidação de verão"
                className="mt-1"
              />
            </div>

            {/* Subtítulo */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Subtítulo *</label>
              <Input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Ex: Até 50% off em itens selecionados"
                className="mt-1"
              />
            </div>

            {/* Produtos em Promoção */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-3">
                Produtos em Promoção (opcional)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-border rounded-lg bg-surface">
                {products.length === 0 ? (
                  <p className="text-xs text-muted-foreground col-span-2">
                    Nenhum produto disponível
                  </p>
                ) : (
                  products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-card p-2 rounded transition"
                    >
                      <input
                        type="checkbox"
                        checked={form.products.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="rounded"
                      />
                      <span className="text-sm text-foreground line-clamp-1">
                        {product.emoji} {product.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="gap-2"
              >
                <Save className="h-4 w-4" /> {editingId ? "Atualizar" : "Criar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Banners */}
      {banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface py-8 text-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-semibold">Nenhum banner criado</p>
          <p className="text-xs text-muted-foreground">Crie seu primeiro banner para o carrossel</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-video bg-surface overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm line-clamp-1">{banner.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {banner.subtitle}
                </p>
                {banner.products.length > 0 && (
                  <p className="text-xs text-primary font-semibold mb-3">
                    {banner.products.length} produto(s) em promoção
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 rounded-lg p-2 hover:bg-primary/10 text-primary transition text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" /> Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Deletar este banner?")) {
                        onDelete(banner.id);
                      }
                    }}
                    className="flex-1 rounded-lg p-2 hover:bg-destructive/10 text-destructive transition text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
