"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/theme/ui/AddToCartButton";
import { Price } from "@/components/theme/ui/Price";

export default function ProductCard({
  product,
  priority,
  imageUrl,
  price,
  currency,
  rating,
  specialPrice,
  reviewCount,
}: {
  product: any;
  priority?: boolean;
  imageUrl?: string;
  price?: any;
  currency?: string;
  rating?: number;
  specialPrice?: any;
  reviewCount?: number;
}) {
  const productName = product?.translation?.name || product?.name || "Product";
  const urlKey = product?.urlKey || "";
  
  // Use passed imageUrl or fallback
  const mainImage = imageUrl || "/placeholder-product.png";
  const altText = productName;

  return (
    <div className="group flex flex-col h-full">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square bg-[#f5f6f8] dark:bg-stone-800 rounded-2xl overflow-hidden mb-6">
        <Link href={`/product/${urlKey}`} className="block w-full h-full">
          <Image
            src={mainImage}
            alt={altText}
            width={500}
            height={500}
            className="w-full h-full object-cover p-8 group-hover:scale-105 transition-transform duration-700"
            priority={priority}
          />
        </Link>
        
        {/* Favorite Button */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-stone-700/80 dark:text-stone-300 rounded-full flex items-center justify-center shadow-md hover:text-red-500 dark:hover:text-red-400 transition-colors z-10 text-stone-400"
          aria-label="Add to Favorites"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Information - Centered */}
      <div className="text-center space-y-2 mb-4 flex-1">
        <Link href={`/product/${urlKey}`}>
          <h3 className="font-headline font-bold text-lg text-foreground hover:text-stone-700 dark:hover:text-stone-300 transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>
        
        {/* Ratings */}
        <div className="flex justify-center text-amber-500 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-3.5 h-3.5 ${i < (rating || 5) ? 'fill-current' : 'text-stone-200 dark:text-stone-700'}`} 
              fill={i < (rating || 5) ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
        </div>
        
        <div className="font-sans font-bold text-foreground">
          <Price
            amount={price?.toString() || "0"}
            currencyCode={currency || "PKR"}
          />
        </div>
      </div>

      {/* Add To Cart Button */}
      <div className="mt-auto">
        <AddToCartButton
          productId={product?.id}
          productUrlKey={urlKey}
          productType={product?.type || "simple"}
          isSaleable={product?.isSaleable || (product?.stock_status === "IN_STOCK" ? "1" : "0")}
          showLabel={true}
          className="w-full py-4 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 transform active:scale-[0.98] bg-white dark:bg-stone-900 flex items-center justify-center text-foreground group-hover:border-stone-400 dark:group-hover:border-stone-500 group-hover:shadow-sm"
        />
      </div>
    </div>
  );
}
