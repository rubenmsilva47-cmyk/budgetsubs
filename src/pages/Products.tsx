import { useState } from "react";
import { useProducts } from "@/context/ProductContext";
import { useCategories } from "@/context/CategoryContext";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLenis } from "@/hooks/useLenis";

const Products = () => {
  useLenis();
  const { products, loading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="products" className="py-16 sm:py-24 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute right-0 top-1/3 w-24 sm:w-48 h-24 sm:w-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center space-y-4 mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Products</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-foreground">Pay less.</span>
                <br />
                <span className="text-gradient">Enjoy more.</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                At the core of everything we do lies a commitment to delivering measurable outcomes that drive your success.
              </p>

              {!categoriesLoading && categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  <Button
                    variant={selectedCategoryId === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-sm"
                  >
                    All Products
                  </Button>
                  {categories.map((category) => {
                    const productCount = products.filter((p) => p.category_id === category.id).length;
                    if (productCount === 0) return null;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategoryId === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategoryId(category.id)}
                        className="text-sm"
                      >
                        {category.name} ({productCount})
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border p-4 sm:p-6 space-y-4">
                    <Skeleton className="aspect-video rounded-xl" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No products found in this category.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;

