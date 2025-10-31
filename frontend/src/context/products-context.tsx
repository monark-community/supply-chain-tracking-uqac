"use client";

import { createContext, useContext, useState } from "react";

export type Product = {
  id: string;
  name: string;
  origin?: string;
  certification?: string;
  status?: "Produced" | "In Transit" | "Delivered";
  location?: string;
  time?: string;
  description?: string;
  category_name?: string;
  variety?: string;
  bag_type?: string;
  quantity?: number | string;
  unit?: string;
  shelf_life_hours?: number;
  notes?: string;
};

type ProductsContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]); // start empty

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
