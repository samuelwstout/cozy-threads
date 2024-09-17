"use client";

import Header from "@/app/_components/header";
import ShoppingCart from "@/app/_components/shoppingCart";
import { Product } from "@/app/api/products/route";
import {
  useOpenShoppingCart,
  useShoppingCartProducts,
} from "@/globalState/shoppingCartStore";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface PageProps {
  params: { id: number };
}

const productDetails = [
  "Only the best materials",
  "Ethically and locally made",
  "Pre-washed and pre-shrunk",
  "Machine wash cold with similar colors",
];

export default function ProductPage({ params }: PageProps) {
  const { id } = params;

  const openShoppingCart = useOpenShoppingCart(
    (state) => state.openShoppingCart
  );

  const setShoppingCartProducts = useShoppingCartProducts(
    (state) => state.setShoppingCartProducts
  );

  const shoppingCartProducts = useShoppingCartProducts(
    (state) => state.shoppingCartProducts
  );

  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product = await response.json();
        setProduct(data);
        setIsError(false);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="bg-white">
      {openShoppingCart && <ShoppingCart />}
      <Header />
      {isLoading ? (
        <div className="flex flex-row h-screen justify-center items-center">
          <BeatLoader size={10} />
        </div>
      ) : isError ? (
        <div className="flex flex-row h-screen justify-center items-center">
          <h1>An error occurred. Please try again later.</h1>
        </div>
      ) : (
        product && (
          <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-5 lg:col-start-8">
                <div className="flex justify-between">
                  <h1 className="text-xl font-medium text-gray-900">
                    {product.title}
                  </h1>
                  <p className="text-xl font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>
              </div>

              {/* Image */}
              <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                <h2 className="sr-only">Image</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                  <img
                    key={product.id}
                    alt={product.title}
                    src={product.imageUrl}
                    className="lg:col-span-2 lg:row-span-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-8 lg:col-span-5">
                {/* Product details */}
                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">
                    Description
                  </h2>

                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="prose prose-sm mt-4 text-gray-500"
                  />
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8">
                  <h2 className="text-sm font-medium text-gray-900">
                    Fabric &amp; Care
                  </h2>

                  <div className="prose prose-sm mt-4 text-gray-500">
                    <ul role="list">
                      {productDetails.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setShoppingCartProducts(product)}
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </main>
        )
      )}
    </div>
  );
}
