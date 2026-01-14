import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/category";
import { toast } from "sonner";

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => Promise<boolean>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        if (error.code !== "PGRST116" && error.message !== "relation \"public.categories\" does not exist") {
          toast.error("Failed to load categories");
        }
        setCategories([]);
      } else {
        setCategories(data as Category[] || []);
      }
    } catch (err) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, "id" | "created_at" | "updated_at">) => {
    const { error } = await supabase.from("categories").insert([category]);
    
    if (error) {
      toast.error("Failed to add category. Make sure you're logged in as admin.");
      return false;
    }
    
    await fetchCategories();
    return true;
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    const { error } = await supabase
      .from("categories")
      .update(updatedFields)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update category");
      return false;
    }
    
    await fetchCategories();
    return true;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete category");
      return false;
    }
    
    await fetchCategories();
    return true;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};

