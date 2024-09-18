import Checkout from "../_components/checkout";
import Header from "@/app/_components/header";
import "../checkout.css";

export default function CheckoutPage() {
  return (
    <div>
      <Header />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Checkout />
      </div>
    </div>
  );
}
