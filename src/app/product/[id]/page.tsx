"use client";

import Header from "@/app/_components/header";
import { Product } from "@/app/api/products/route";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface PageProps {
  params: { id: number };
}

export default function ProductPage({ params }: PageProps) {
  const { id } = params;

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
  }, []);

  return (
    <>
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
        product && <div></div>
      )}
    </>
  );
}
