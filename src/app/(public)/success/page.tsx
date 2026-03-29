import type { Metadata } from "next";
import OrderDetail from "@components/cart/OrderDetail";

export const metadata: Metadata = {
  title: "Order Confirmed | LALA Fashion",
  description: "Your LALA Fashion order has been successfully placed. Thank you for shopping with us!",
  robots: { index: false, follow: false },
};

const SuccessPage = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-12 pb-20 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <OrderDetail />
      </div>
    </div>
  );
};

export default SuccessPage;
