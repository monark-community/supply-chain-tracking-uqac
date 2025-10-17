"use client"

import { createContext, useContext, useState } from "react"

export type Product = {
  id: string
  name: string
  origin: string
  certification: string
  status: "Produced" | "In Transit" | "Delivered"
  location: string
  time: string
}

type ProductsContextType = {
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Organic Coffee Beans",
      origin: "Colombia",
      certification: "FairTrade",
      status: "In Transit",
      location: "Distribution Center A",
      time: "2 hours ago",
    },
    {
      id: "PRD-002",
      name: "Premium Olive Oil",
      origin: "Italy",
      certification: "BIO",
      status: "Delivered",
      location: "Retail Store #42",
      time: "1 day ago",
    },
    {
      id: "PRD-003",
      name: "Artisan Cheese",
      origin: "France",
      certification: "AOP",
      status: "Produced",
      location: "Farm Location",
      time: "3 hours ago",
    },
  ])

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider")
  return ctx
}
