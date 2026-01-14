import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "created_at" | "updated_at">) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load products");
        setProducts([]);
      } else {
        setProducts(data as Product[] || []);
      }
    } catch (err) {
      setProducts([]);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("products").insert([product]);
    
    if (error) {
      toast.error("Failed to add product. Make sure you're logged in as admin.");
      return false;
    }
    
    await fetchProducts();
    return true;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    const { error } = await supabase
      .from("products")
      .update(updatedFields)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update product");
      return false;
    }
    
    await fetchProducts();
    return true;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      return false;
    }
    
    await fetchProducts();
    return true;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, fetchProducts, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
