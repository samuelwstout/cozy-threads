"use client";

import Footer from "./_components/footer";
import Header from "./_components/header";
import ProductList from "./_components/productList";

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col justify-between">
      <Header />
      <ProductList />
      <Footer />
    </main>
  );
}
