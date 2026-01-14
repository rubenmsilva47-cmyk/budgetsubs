export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  duration: string;
  image: string;
  badge?: "NEW" | "FRESH" | "HOT" | null;
  stock?: number | null;
  paylix_product_id?: string | null;
  category_id?: string | null;
  created_at?: string;
  updated_at?: string;
}
