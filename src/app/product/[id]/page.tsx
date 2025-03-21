import Header from "@/app/_components/Header";
import { Product } from "@/app/api/products/route";
import { ProductActions } from "@/app/_components/ProductActions";

interface PageProps {
  params: { id: number };
}

const productDetails = [
  "Only the best materials",
  "Ethically and locally made",
  "Pre-washed and pre-shrunk",
  "Machine wash cold with similar colors",
];

export default async function ProductPage({ params }: PageProps) {
  const { id } = params;

  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://cozy-threads-red.vercel.app"
        : "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/product/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const product: Product = await response.json();

    return (
      <div className="bg-white">
        <Header renderShoppingCart />
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

            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
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
              <div>
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

              <ProductActions product={product} />
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error fetching product";
    return (
      <div className="bg-white">
        <Header renderShoppingCart />
        <div className="flex flex-row h-screen justify-center items-center">
          <h1>{errorMessage}</h1>
        </div>
      </div>
    );
  }
}
