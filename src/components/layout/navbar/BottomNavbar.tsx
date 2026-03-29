"use client";

import Cart from "@components/cart";
import { CategoryIcon } from "@components/common/icons/CategoryIcon";
import { HomeIcon } from "@components/common/icons/HomeIcon";
import { IconSkeleton } from "@components/common/skeleton/IconSkeleton";
import UserAccount from "@components/customer/credentials";
import Link from "next/link";
import { Suspense, memo } from "react";
import clsx from "clsx";
import OpenCart from "@components/cart/OpenCart";
import { useAppSelector } from "@/store/hooks";
import OpenAuth from "@components/customer/OpenAuth";

type Tab = "home" | "category" | "cart" | "account" | null;

const BottomNavbar = memo(function BottomNavbar({
  onMenuOpen,
  activeTab,
  setActiveTab,
}: {
  onMenuOpen: () => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const cartDetail = useAppSelector((state) => state.cartDetail);
  const itemBase = "flex flex-col items-center justify-center w-full h-full gap-[2px] text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer";

  const getIconWrapperClass = (tab: Tab) =>
    clsx(
      "flex items-center justify-center rounded-2xl transition-all duration-300 px-5 py-1 sm:px-6 sm:py-1.5",
      activeTab === tab
        ? "bg-selected-color dark:bg-selected-bg-bottom-dark dark:text-selected-bottom-dark"
        : "bg-transparent text-neutral-900 dark:text-neutral-400"
    );

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <nav className="h-16 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black px-1 sm:px-2">
        <div className="mx-auto grid h-full w-full max-w-md grid-cols-4">

          {/* Home */}
          <Link
            href="/"
            aria-label="Go to Home Page"
            onClick={() => setActiveTab("home")}
            className={itemBase}
          >
            <div className={getIconWrapperClass("home")}>
              <HomeIcon />
            </div>
            <span>Home</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => {
              setActiveTab("category");
              onMenuOpen();
            }}
            type="button"
            className={itemBase}
          >
            <div className={getIconWrapperClass("category")}>
              <CategoryIcon />
            </div>
            <span>Categories</span>
          </button>

          {/* Cart */}
          <Cart
            className={itemBase}
            onOpen={() => setActiveTab("cart")}
            onClose={() => setActiveTab(null)}
            isOpen={activeTab === "cart"}
          >
            <div className={getIconWrapperClass("cart")}>
              <OpenCart quantity={cartDetail?.cart?.itemsQty} />
            </div>
            <span>Cart</span>
          </Cart>

          {/* Account */}
          <Suspense fallback={<IconSkeleton />}>
            <UserAccount
              className={itemBase}
              onOpen={() => setActiveTab("account")}
              onClose={() => setActiveTab(null)}
              isOpen={activeTab === "account"}
            >
              <div className={getIconWrapperClass("account")}>
                <OpenAuth />
              </div>
              <span>Account</span>
            </UserAccount>
          </Suspense>

        </div>
      </nav>
    </div>
  );
});

export default BottomNavbar;
