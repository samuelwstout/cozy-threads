"use client";

import { useOpenShoppingCart } from "@/globalState/shoppingCartStore";
import ShoppingCart from "./ShoppingCart";

export function ShoppingCartWrapper() {
  const openShoppingCart = useOpenShoppingCart(
    (state) => state.openShoppingCart
  );

  return openShoppingCart ? <ShoppingCart /> : null;
}
