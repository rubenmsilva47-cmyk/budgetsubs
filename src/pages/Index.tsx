import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FlowingMenu from "@/components/FlowingMenu";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { useLenis } from "@/hooks/useLenis";
import { useProducts } from "@/context/ProductContext";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  useLenis();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { settings } = useSiteSettings();

  const featuredProducts = useMemo(() => {
    if (products.length === 0) return [];
    const selectedIds = [
      settings.featured_product_1_id,
      settings.featured_product_2_id,
      settings.featured_product_3_id,
    ].filter(Boolean);
    
    if (selectedIds.length === 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }
    
    const selected = selectedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as typeof products;
    
    while (selected.length < 3 && products.length > selected.length) {
      const remaining = products.filter(p => !selectedIds.includes(p.id));
      if (remaining.length === 0) break;
      const shuffled = [...remaining].sort(() => 0.5 - Math.random());
      selected.push(shuffled[0]);
    }
    
    return selected.slice(0, 3);
  }, [products, settings.featured_product_1_id, settings.featured_product_2_id, settings.featured_product_3_id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <div className="w-full overflow-hidden">
          <FlowingMenu />
        </div>
        <section id="products" className="py-16 sm:py-24 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-64 h-32 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute right-0 top-1/3 w-24 sm:w-48 h-24 sm:w-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center space-y-4 mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-muted-foreground">Featured Products</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-foreground">Pay less.</span>
                <br />
                <span className="text-gradient">Enjoy more.</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
                At the core of everything we do lies a commitment to delivering measurable outcomes that drive your success.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {[...Array(3)].map((_, i) => (
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
                {featuredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">No products available.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {featuredProducts.map((product, index) => (
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
                <div className="text-center mt-10 sm:mt-16">
                  <Button variant="hero" size="lg" onClick={() => navigate("/products")}>
                    Browse All Products
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
