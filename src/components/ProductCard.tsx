import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";

interface ProductCardProps {
  product: Product;
}

declare global {
  interface Window {
    PaylixEcommerce?: any;
  }
}

const badgeColors = {
  NEW: "bg-primary text-primary-foreground",
  FRESH: "bg-emerald-500 text-primary-foreground",
  HOT: "bg-orange-500 text-primary-foreground",
};

const ProductCard = ({ product }: ProductCardProps) => {
  const savings = Math.round(((product.original_price - product.price) / product.original_price) * 100);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const checkPaylix = () => {
      if (window.PaylixEcommerce && formRef.current) {
        return;
      }
    };

    checkPaylix();

    const timeout = setTimeout(checkPaylix, 1000);
    return () => clearTimeout(timeout);
  }, [product.paylix_product_id]);

  return (
    <div className="group relative rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative aspect-video overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        {product.badge && (
          <Badge className={`absolute top-4 right-4 ${badgeColors[product.badge]} shadow-lg`}>{product.badge}</Badge>
        )}
      </div>
      <div className="relative p-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">${product.price}</span>
          <span className="text-sm text-muted-foreground line-through">${product.original_price}/yearly</span>
          <Badge variant="secondary" className="bg-primary/15 text-primary border border-primary/20 font-semibold">Save {savings}%</Badge>
        </div>
        <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        {product.stock !== null && product.stock !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? "bg-emerald-400 shadow-emerald-400/50 shadow-sm" : product.stock > 0 ? "bg-amber-400 shadow-amber-400/50 shadow-sm" : "bg-destructive"}`} />
            <span className="text-xs text-muted-foreground font-medium">
              {product.stock > 20 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
            </span>
          </div>
        )}
        <div className="flex gap-3 pt-2">
          {product.paylix_product_id ? (
            <form 
              ref={formRef}
              className="flex-1"
              onSubmit={(e) => {
                if (!window.PaylixEcommerce) {
                  e.preventDefault();
                }
              }}
            >
              <button
                data-paylixecommerce-product={product.paylix_product_id}
                type="submit"
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={product.stock === 0}
              >
                Purchase
              </button>
            </form>
          ) : (
            <Button variant="hero" className="flex-1" disabled>
              Purchase
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href="/#how">How it works?</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;