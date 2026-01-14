import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Edit2, Plus, Trash2, Package, LogOut, Box, AlertCircle, Settings, Tag } from "lucide-react";
import DarkVeil from "@/components/DarkVeil";
import SiteSettingsManager from "@/components/admin/SiteSettingsManager";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories, loading: categoriesLoading, addCategory, updateCategory, deleteCategory } = useCategories();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    duration: "12 months",
    image: "",
    badge: "" as "" | "NEW" | "FRESH" | "HOT",
    stock: "",
    paylix_product_id: "",
    category_id: "",
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    slug: "",
  });

  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  useEffect(() => {
    if (user) {
      setAdminCheckComplete(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (user) {
        if (isAdmin) {
          setAdminCheckComplete(true);
          return;
        }

        const checkAdmin = setTimeout(() => {
          setAdminCheckComplete(true);
          if (!isAdmin) {
            navigate("/");
          }
        }, 1000);

        return () => clearTimeout(checkAdmin);
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      original_price: "",
      duration: "12 months",
      image: "",
      badge: "",
      stock: "",
      paylix_product_id: "",
      category_id: "",
    });
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      slug: "",
    });
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      original_price: parseFloat(formData.original_price),
      duration: formData.duration,
      image: formData.image || "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop",
      badge: (formData.badge === "none" || !formData.badge) ? null : formData.badge,
      stock: formData.stock ? parseInt(formData.stock) : null,
      paylix_product_id: formData.paylix_product_id || null,
      category_id: (formData.category_id === "none" || !formData.category_id) ? null : formData.category_id,
    };

    const success = editingProduct
      ? await updateProduct(editingProduct.id, productData)
      : await addProduct(productData);

    if (success) {
      toast.success(editingProduct ? "Product updated" : "Product added");
      resetForm();
      setIsDialogOpen(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = categoryFormData.slug || categoryFormData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    const categoryData = {
      name: categoryFormData.name,
      slug: slug,
    };

    const success = editingCategory
      ? await updateCategory(editingCategory.id, categoryData)
      : await addCategory(categoryData);

    if (success) {
      toast.success(editingCategory ? "Category updated" : "Category added");
      resetCategoryForm();
      setIsCategoryDialogOpen(false);
    }
  };

  const handleEdit = (product: Product) => {
    try {
      if (!product) {
        toast.error("Invalid product data");
        return;
      }

      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        original_price: product.original_price?.toString() || "",
        duration: product.duration || "12 months",
        image: product.image || "",
        badge: (product.badge as "" | "NEW" | "FRESH" | "HOT") || "none",
        stock: product.stock?.toString() || "",
        paylix_product_id: product.paylix_product_id || "",
        category_id: product.category_id || "none",
      });
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("Failed to open edit dialog");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      slug: category.slug,
    });
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (await deleteCategory(id)) {
      toast.success("Category deleted");
    }
  };

  const handleDelete = async (id: string) => {
    if (await deleteProduct(id)) {
      toast.success("Product deleted");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user && !isAdmin && !adminCheckComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin && adminCheckComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">Admin privileges required.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <DarkVeil speed={0.2} hueShift={25} warpAmount={0.2} />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
            </div>

            <div className="flex items-center gap-3">
              <Dialog 
                open={isDialogOpen} 
                onOpenChange={(open) => { 
                  setIsDialogOpen(open); 
                  if (!open) {
                    resetForm();
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[<>]/g, "");
                          setFormData({ ...formData, name: sanitized });
                        }}
                        required
                        className="mt-1.5"
                        maxLength={200}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => {
                          const sanitized = e.target.value.replace(/[<>]/g, "");
                          setFormData({ ...formData, description: sanitized });
                        }}
                        required
                        className="mt-1.5 resize-none"
                        rows={3}
                        maxLength={2000}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Original ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.original_price}
                          onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                          required
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="Optional"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Badge</Label>
                        <Select
                          value={formData.badge || "none"}
                          onValueChange={(v) => setFormData({ ...formData, badge: (v === "none" ? "" : v) as "" | "NEW" | "FRESH" | "HOT" })}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="NEW">NEW</SelectItem>
                            <SelectItem value="FRESH">FRESH</SelectItem>
                            <SelectItem value="HOT">HOT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Paylix Product ID</Label>
                      <Input
                        value={formData.paylix_product_id}
                        onChange={(e) => {
                          const id = e.target.value.trim();
                          setFormData({ ...formData, paylix_product_id: id });
                        }}
                        placeholder="6949da2266ff7"
                        className="mt-1.5"
                        maxLength={100}
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">Enter your Paylix product ID (e.g., 6949da2266ff7)</p>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={formData.category_id || "none"}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value === "none" ? "" : value })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="No category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          ) : null}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Image URL</Label>
                      <Input
                        value={formData.image}
                        onChange={(e) => {
                          const url = e.target.value.trim();
                          if (!url || url.startsWith("http://") || url.startsWith("https://")) {
                            setFormData({ ...formData, image: url });
                          }
                        }}
                        placeholder="https://..."
                        className="mt-1.5"
                        type="url"
                        maxLength={500}
                      />
                    </div>
                    <DialogFooter className="gap-2 pt-4">
                      <Button type="button" variant="ghost" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="default">
                        {editingProduct ? "Save Changes" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Tabs defaultValue="products" className="space-y-8">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Tag className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="w-4 h-4 mr-2" />
                Site Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                      <p className="text-2xl font-semibold text-foreground">{products.length}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Box className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">In Stock</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {products.filter((p) => p.stock === null || p.stock! > 0).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Low Stock</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {products.filter((p) => p.stock !== null && p.stock! > 0 && p.stock! <= 20).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-border transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-foreground truncate">{product.name}</h3>
                          {product.badge && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                              product.badge === "NEW"
                                ? "bg-primary/20 text-primary"
                                : product.badge === "FRESH"
                                  ? "bg-emerald-500/20 text-emerald-500"
                                  : "bg-orange-500/20 text-orange-500"
                            }`}>
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-semibold text-foreground">${product.price}</span>
                          <span className="text-sm text-muted-foreground line-through">${product.original_price}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {product.stock !== null ? (
                            <span className={
                              product.stock === 0
                                ? "text-destructive"
                                : product.stock <= 20
                                  ? "text-amber-500"
                                  : "text-emerald-500"
                            }>
                              {product.stock} in stock
                            </span>
                          ) : (
                            <span>Unlimited</span>
                          )}
                          {product.paylix_product_id && (
                            <span className="text-primary">Paylix ID set</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && (
                <div className="text-center py-16">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products yet. Add your first product to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="categories" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Categories</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage product categories</p>
                </div>
                <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => { setIsCategoryDialogOpen(open); if (!open) resetCategoryForm(); }}>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4 mt-4">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={categoryFormData.name}
                          onChange={(e) => {
                            const sanitized = e.target.value.replace(/[<>]/g, "");
                            setCategoryFormData({ ...categoryFormData, name: sanitized });
                            if (!editingCategory && !categoryFormData.slug) {
                              const slug = sanitized.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                              setCategoryFormData((prev) => ({ ...prev, slug }));
                            }
                          }}
                          required
                          className="mt-1.5"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <Label>Slug</Label>
                        <Input
                          value={categoryFormData.slug}
                          onChange={(e) => {
                            const slug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                            setCategoryFormData({ ...categoryFormData, slug });
                          }}
                          required
                          className="mt-1.5"
                          maxLength={100}
                          placeholder="category-slug"
                        />
                        <p className="text-xs text-muted-foreground mt-1">URL-friendly identifier</p>
                      </div>
                      <DialogFooter className="gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => { resetCategoryForm(); setIsCategoryDialogOpen(false); }}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="default">
                          {editingCategory ? "Save Changes" : "Create"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {categoriesLoading ? (
                <div className="text-center py-16">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const productsInCategory = products.filter((p) => p.category_id === category.id).length;
                    return (
                      <div
                        key={category.id}
                        className="group p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-border transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">/{category.slug}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {productsInCategory} {productsInCategory === 1 ? "product" : "products"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!categoriesLoading && categories.length === 0 && (
                <div className="text-center py-16">
                  <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No categories yet. Add your first category to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettingsManager />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Admin;