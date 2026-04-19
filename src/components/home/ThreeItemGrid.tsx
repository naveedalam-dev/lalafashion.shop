"use client"

import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import { GridTileImage } from "@/components/theme/ui/grid/Tile";

interface ThreeItemGridProps {
    title: string;
    description: string;
    products: Array<{
        id: string;
        name: string;
        urlKey: string;
        baseImageUrl: string;
        price: string | number;
        specialPrice?: string | number | null;
        type: string;
    }>;
}

interface ProductItem {
    id: string;
    name: string;
    urlKey: string;
    baseImageUrl: string;
    price: string | number;
    specialPrice?: string | number | null;
    type: string;
}

// ── Single Product Card ───────────────────────────────────────────────────────
function ProductCard({ product, priority, index }: {
    product: ProductItem;
    priority?: boolean;
    index: number;
}) {
    const isCenter = index === 1;

    return (
        <Link
            href={`/product/${product.urlKey}`}
            aria-label={product.name}
            className={clsx(
                "group relative block overflow-hidden rounded-2xl",
                "transition-all duration-500",
                // Center card is slightly taller for visual interest
                isCenter ? "aspect-[3/4]" : "aspect-[3/4] md:aspect-[4/5]"
            )}
        >
            {/* Badge */}
            <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white uppercase">
                    New
                </span>
            </div>

            {/* Image */}
            <GridTileImage
                src={product.baseImageUrl}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                priority={priority}
                alt={product.name}
                label={{
                    position: "bottom",
                    title: product.name,
                    amount: String(product.specialPrice || product.price || '0'),
                    originalAmount: product.specialPrice ? String(product.price) : undefined,
                    currencyCode: 'PKR',
                }}
            />

            {/* Hover shine effect */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        </Link>
    );
}

// ── Mobile Card ───────────────────────────────────────────────────────────────
function MobileProductCard({ product, priority, featured }: {
    product: ProductItem;
    priority?: boolean;
    featured?: boolean;
}) {
    return (
        <Link
            href={`/product/${product.urlKey}`}
            aria-label={product.name}
            className={clsx(
                "group relative block overflow-hidden rounded-xl",
                featured ? "col-span-2 aspect-[16/9]" : "col-span-1 aspect-square"
            )}
        >
            {/* Badge */}
            <div className="absolute top-2 left-2 z-10">
                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold tracking-widest text-white uppercase">
                    New
                </span>
            </div>

            <GridTileImage
                src={product.baseImageUrl}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                priority={priority}
                alt={product.name}
                label={{
                    position: "bottom",
                    title: product.name,
                    amount: String(product.specialPrice || product.price || '0'),
                    originalAmount: product.specialPrice ? String(product.price) : undefined,
                    currencyCode: 'PKR',
                }}
            />
        </Link>
    );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export const ThreeItemGrid: FC<ThreeItemGridProps> = ({ title, description, products }) => {
    if (!products || products.length < 3) return null;

    const [firstProduct, secondProduct, thirdProduct] = products;

    return (
        <section className="pt-8 sm:pt-12 lg:pt-20">
            {/* Section Header */}
            <div className="mx-auto mb-10 w-auto px-0 text-center">
                <h1 className="mb-3 font-outfit text-xl md:text-4xl font-semibold text-black dark:text-white">
                    {title}
                </h1>
                <p className="text-sm md:text-base font-normal text-black/60 dark:text-neutral-300">
                    {description}
                </p>
            </div>

            {/* Desktop: Equal 3-column layout */}
            <div className="hidden md:grid grid-cols-3 gap-5 items-end">
                <ProductCard product={firstProduct} priority={true} index={0} />
                <ProductCard product={secondProduct} priority={true} index={1} />
                <ProductCard product={thirdProduct} priority={false} index={2} />
            </div>

            {/* Mobile: Featured top + 2 below */}
            <div className="grid md:hidden grid-cols-2 gap-3">
                <MobileProductCard product={firstProduct} priority={true} featured={true} />
                <MobileProductCard product={secondProduct} priority={true} featured={false} />
                <MobileProductCard product={thirdProduct} priority={false} featured={false} />
            </div>
        </section>
    );
};

export default ThreeItemGrid;
