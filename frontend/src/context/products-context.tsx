"use client";

import { createContext, useContext, useState } from "react";

// Type definition for a single product
export type Product = {
  id: string;                    // Unique product identifier
  name: string;                  // Product name
  origin?: string;               // Optional origin or source
  certification?: string;        // Optional certification info
  status?: "Produced" | "In Transit" | "Delivered"; // Current status
  location?: string;             // Current location
  time?: string;                 // Timestamp or date info
  description?: string;          // Optional description
  category_name?: string;        // Optional category name
  variety?: string;              // Optional product variety
  bag_type?: string;             // Optional bag type
  quantity?: number | string;    // Optional quantity
  unit?: string;                 // Optional unit of measure
  shelf_life_hours?: number;     // Optional shelf life in hours
  notes?: string;                // Optional additional notes
};

// Context type: holds products array and a setter function
type ProductsContextType = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

// Create the context (initially undefined)
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * ProductsProvider wraps components that need access to products state.
 */
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]); // Start with empty array

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children} {/* Render children with access to products state */}
    </ProductsContext.Provider>
  );
}

/**
 * useProducts hook: provides easy access to products context
 * Must be used inside a ProductsProvider
 */
export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
