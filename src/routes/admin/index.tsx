import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, X, Save, Lock, Image } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { AdminLogin } from "@/components/AdminLogin";
import { BannerManager } from "@/components/BannerManager";
import { verifySession } from "@/lib/api/auth.functions";
import { getBanners, saveBanners, updateBanner, deleteBanner } from "@/lib/banners";
import type { Product } from "@/lib/products";
import type { Banner } from "@/lib/banners";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin · Verdemar" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"banners" | "produtos">("produtos");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    unit: "",
    category: "frutas",
    emoji: "🍎",
    tint: "#fdecec",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const categories = [
    { id: "frutas", name: "Frutas", emoji: "🍎" },
    { id: "verduras", name: "Verduras", emoji: "🥬" },
    { id: "carnes", name: "Carnes", emoji: "🥩" },
    { id: "padaria", name: "Padaria", emoji: "🥖" },
    { id: "laticinios", name: "Laticínios", emoji: "🥛" },
    { id: "bebidas", name: "Bebidas", emoji: "🧃" },
    { id: "mercearia", name: "Mercearia", emoji: "🍚" },
    { id: "limpeza", name: "Limpeza", emoji: "🧴" },
  ];

  // Verificar sessão ao carregar
  useEffect(() => {
    const checkSession = async () => {
      const token = sessionStorage.getItem("admin_token");
      const username = sessionStorage.getItem("admin_user");

      if (token && username) {
        try {
          const result = await verifySession({
            data: { token },
          });

          if (result.valid) {
            setIsAuthenticated(true);
            setCurrentUser(username);
          } else {
            // Token expirado
            sessionStorage.removeItem("admin_token");
            sessionStorage.removeItem("admin_user");
            setIsAuthenticated(false);
            setCurrentUser(null);
          }
        } catch (err) {
          console.error("Erro ao verificar sessão:", err);
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
    };

    checkSession();
  }, []);

  // Carregar produtos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  // Carregar banners do localStorage
  useEffect(() => {
    setBanners(getBanners());
  }, []);

  const handleLoginSuccess = (token: string) => {
    const username = sessionStorage.getItem("admin_user");
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // Handlers para banners
  const handleSaveBanner = (banner: Banner) => {
    if (banners.some((b) => b.id === banner.id)) {
      updateBanner(banner.id, banner);
    } else {
      const allBanners = getBanners();
      saveBanners([...allBanners, banner]);
    }
    setBanners(getBanners());
  };

  const handleDeleteBanner = (id: string) => {
    deleteBanner(id);
    setBanners(getBanners());
  };

  // Salvar produtos no localStorage
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("admin_products", JSON.stringify(newProducts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.unit) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      // Editar
      const updated = products.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
              unit: form.unit,
              category: form.category,
              emoji: form.emoji,
              tint: form.tint,
              image: form.image || undefined,
            }
          : p
      );
      saveProducts(updated);
      setEditingId(null);
    } else {
      // Adicionar novo
      const newProduct: Product = {
        id: Date.now().toString(),
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
        unit: form.unit,
        category: form.category,
        emoji: form.emoji,
        tint: form.tint,
        image: form.image || undefined,
      };
      saveProducts([...products, newProduct]);
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      unit: "",
      category: "frutas",
      emoji: "🍎",
      tint: "#fdecec",
      image: "",
    });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || "",
      unit: product.unit,
      category: product.category,
      emoji: product.emoji,
      tint: product.tint,
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      saveProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    setForm((f) => ({
      ...f,
      category: categoryId,
      emoji: cat?.emoji || f.emoji,
    }));
  };

  // Agrupar produtos por categoria
  const groupedProducts = categories.reduce(
    (acc, cat) => {
      acc[cat.id] = {
        name: cat.name,
        emoji: cat.emoji,
        products: products.filter((p) => p.category === cat.id),
      };
      return acc;
    },
    {} as Record<string, { name: string; emoji: string; products: Product[] }>
  );

  // Categorias com produtos
  const categoriesWithProducts = categories.filter(
    (cat) => groupedProducts[cat.id].products.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 via-primary/15 to-background pb-24 md:pb-12">
      <Header hideSearch={true} />
      <main className="mx-auto max-w-6xl px-4 py-5">
        {/* Componente de Login */}
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />

        {/* Conteúdo Admin (apenas se autenticado) */}
        {!isAuthenticated ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-sm text-gray-600">Faça login acima para acessar o painel de administração</p>
          </div>
        ) : (
          <>
            {/* Abas */}
            <div className="mb-8 border-b border-border flex gap-1">
              <button
                onClick={() => setActiveTab("produtos")}
                className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                  activeTab === "produtos"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plus className="h-4 w-4 inline mr-2" />
                Produtos
              </button>
              <button
                onClick={() => setActiveTab("banners")}
                className={`px-4 py-3 font-semibold text-sm transition border-b-2 ${
                  activeTab === "banners"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Image className="h-4 w-4 inline mr-2" />
                Banners
              </button>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === "banners" ? (
              <BannerManager
                banners={banners}
                onSave={handleSaveBanner}
                onDelete={handleDeleteBanner}
                products={products}
              />
            ) : (
              <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Gerenciar Produtos</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione, edite ou remova produtos do catálogo
              </p>
            </div>

            {/* Botão para abrir formulário */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Adicionar Produto
              </button>
            )}

            {/* Formulário */}
            {showForm && (
              <div className="mb-6 rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Editar Produto" : "Novo Produto"}
              </h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Nome *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Maçã Gala"
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Descrição *</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Ex: Bandeja com 6 unidades"
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Preço *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="Ex: 9.90"
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Preço Antigo */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Preço Antigo (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="Ex: 12.90"
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Unidade */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Unidade *</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    placeholder="Ex: kg, un, bandeja"
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Categoria *</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Emote */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Emote</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    maxLength={2}
                    className="mt-1 w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Imagem PNG */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Imagem PNG (opcional)</label>
                  <input
                    type="file"
                    accept="image/png"
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
                    className="mt-1 w-full text-sm file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:px-3 file:py-2 file:cursor-pointer file:text-xs file:font-semibold hover:file:opacity-90 transition"
                  />
                  {form.image && (
                    <div className="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Cor de fundo */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Cor de fundo</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="color"
                      value={form.tint}
                      onChange={(e) => setForm({ ...form, tint: e.target.value })}
                      className="h-10 w-16 rounded-lg border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.tint}
                      onChange={(e) => setForm({ ...form, tint: e.target.value })}
                      className="flex-1 h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  <Save className="h-4 w-4" /> {editingId ? "Atualizar" : "Adicionar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold transition hover:bg-surface"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Produtos por Categoria */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Produtos ({products.length})</h2>
            {products.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {categoriesWithProducts.length} categoria(s) com produtos
              </div>
            )}
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface py-12 text-center">
              <p className="text-sm font-semibold">Nenhum produto adicionado</p>
              <p className="text-xs text-muted-foreground">Comece adicionando seu primeiro produto</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoriesWithProducts.map((category) => {
                const categoryData = groupedProducts[category.id];
                const categoryProducts = categoryData.products;

                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    {/* Cabeçalho da Categoria */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categoryData.emoji}</span>
                          <div>
                            <h3 className="text-sm font-semibold">{categoryData.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {categoryProducts.length} produto{categoryProducts.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            {categoryProducts.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tabela de Produtos */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-surface/50">
                            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                              Produto
                            </th>
                            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                              Imagem
                            </th>
                            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                              Preço
                            </th>
                            <th className="text-left p-3 text-xs font-semibold text-muted-foreground">
                              Unidade
                            </th>
                            <th className="text-right p-3 text-xs font-semibold text-muted-foreground">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryProducts.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-border hover:bg-surface/50 transition"
                            >
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{product.emoji}</span>
                                  <div>
                                    <div className="text-sm font-semibold">{product.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {product.description}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                {product.image ? (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">
                                    -
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-sm font-semibold">
                                R$ {product.price.toFixed(2)}
                                {product.oldPrice && (
                                  <div className="text-xs text-muted-foreground line-through">
                                    R$ {product.oldPrice.toFixed(2)}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-sm">{product.unit}</td>
                              <td className="p-3">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEdit(product)}
                                    className="rounded-full p-2 hover:bg-primary/10 text-primary transition"
                                    aria-label="Editar"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(product.id)}
                                    className="rounded-full p-2 hover:bg-destructive/10 text-destructive transition"
                                    aria-label="Deletar"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
              </>
            )}
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
