"use client";

import { useEffect, useState } from "react";
import Footer from "./_components/footer";
import Header from "./_components/header";
import ProductList from "./_components/productList";
import { Product } from "./api/products/route";
import { BeatLoader } from "react-spinners";
import ShoppingCart from "./_components/shoppingCart";
import { useOpenShoppingCart } from "@/globalState/shoppingCartStore";

export default function Home() {
  const openShoppingCart = useOpenShoppingCart(
    (state) => state.openShoppingCart
  );

  const [products, setProducts] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product[] = await response.json();
        setProducts(data);
        setIsError(false);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="w-full h-screen flex flex-col justify-between">
      {openShoppingCart && <ShoppingCart />}
      <Header />
      {isLoading ? (
        <div className="flex flex-row justify-center items-center">
          <BeatLoader size={10} />
        </div>
      ) : isError ? (
        <div className="flex flex-row justify-center items-center">
          <h1>An error occurred. Please try again later.</h1>
        </div>
      ) : (
        products && <ProductList products={products} />
      )}
      <Footer />
    </main>
  );
}
