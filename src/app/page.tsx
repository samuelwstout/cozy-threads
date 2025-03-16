import Footer from "./_components/footer";
import Header from "./_components/header";
import ProductList from "./_components/productList";
import { Product } from "./api/products/route";
import { ShoppingCartWrapper } from "./_components/ShoppingCartWrapper";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://cozy-threads-red.vercel.app"
    : "http://localhost:3000";

export default async function Home() {
  try {
    const response = await fetch(`${baseUrl}/api/products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products: Product[] = await response.json();

    return (
      <main className="w-full h-screen flex flex-col justify-between">
        <ShoppingCartWrapper />
        <Header renderShoppingCart />
        <ProductList products={products} />
        <Footer />
      </main>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error fetching products";
    return (
      <main className="w-full h-screen flex flex-col justify-between">
        <Header renderShoppingCart />
        <div className="flex flex-row justify-center items-center">
          <h1>{errorMessage}</h1>
        </div>
        <Footer />
      </main>
    );
  }
}
