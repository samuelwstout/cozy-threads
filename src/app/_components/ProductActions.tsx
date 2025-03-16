"use client";

import { Product } from "@/app/api/products/route";
import {
  useOpenShoppingCart,
  useShoppingCartProducts,
} from "@/globalState/shoppingCartStore";
import ShoppingCart from "./shoppingCart";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const openShoppingCart = useOpenShoppingCart(
    (state) => state.openShoppingCart
  );
  const setShoppingCartProducts = useShoppingCartProducts(
    (state) => state.setShoppingCartProducts
  );

  return (
    <>
      {openShoppingCart && <ShoppingCart />}
      <button
        onClick={() => setShoppingCartProducts(product)}
        className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-slate-600 px-8 py-3 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
      >
        Add to cart
      </button>
    </>
  );
}
