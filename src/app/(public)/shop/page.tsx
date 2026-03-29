import dynamicImport from "next/dynamic";
import { Suspense } from "react";
import { isArray } from "@/utils/type-guards";
import { createClient } from "@/utils/supabase/server";
import SortOrder from "@/components/theme/filters/SortOrder";
import { SortByFields } from "@/utils/constants";
import MobileFilter from "@/components/theme/filters/MobileFilter";
import ShopFilterList from "@/components/theme/filters/ShopFilterList";
import NotFound from "@/components/theme/search/not-found";

const Pagination = dynamicImport(
  () => import("@/components/catalog/Pagination"),
);
const ProductGridItems = dynamicImport(
  () => import("@/components/catalog/product/ProductGridItems"),
);

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  return {
    title: "Shop All Products | LALA Fashion",
    description: "Browse LALA Fashion's full collection of premium luxury gifts, jewelry, watches, and high-end accessories. Shop online with fast delivery across Pakistan.",
    alternates: { canonical: "https://www.lalafashion.store/shop" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: "Shop All Products | LALA Fashion",
      description: "Premium luxury gifts — watches, jewelry, accessories and more. Shop now at LALA Fashion.",
      url: "https://www.lalafashion.store/shop",
      siteName: "LALA Fashion",
      type: "website",
      images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    q: searchValue,
    page,
    sort: sortValue = "name-asc",
    category: categorySlug,
    stock: stockFilter,
    rating: ratingFilter,
    minPrice,
    maxPrice,
  } = (params || {}) as { [key: string]: string };

  const itemsPerPage = 12;
  const currentPage = page ? parseInt(page) - 1 : 0;

  // 1. Fetch Categories for Sidebar (from homepage_categories)
  const { data: homepageCategories } = await supabase
    .from("homepage_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  // Build sidebar categories list
  const sidebarCategories = (homepageCategories || []).map((c) => ({
    id: c.id,
    title: c.title as string,
    slug: (c.link_url as string)?.replace("/category/", "") || c.id,
  }));

  // 2. Fetch Price Range (to power the slider)
  const { data: priceData } = await supabase
    .from("products")
    .select("sale_price")
    .eq("stock_status", "ACTIVE")
    .order("sale_price", { ascending: true });

  const prices = (priceData || []).map((p) => Number(p.sale_price)).filter(Boolean);
  const priceRange = {
    min: prices.length ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length ? Math.ceil(Math.max(...prices)) : 100000,
  };

  // 3. Build Products Query
  let query = supabase
    .from("products")
    .select(
      `id, name, slug, image_url, sale_price, mrp, stock_status, available_qty, category_id,
       category:categories!products_category_id_fkey (id, name, slug),
       product_reviews(rating)`,
      { count: "exact" }
    )
    .eq("stock_status", "ACTIVE");

  // ── Filter: Search ──
  if (searchValue) {
    query = query.ilike("name", `%${searchValue}%`);
  }

  // ── Filter: Category (by slug) ──
  if (categorySlug) {
    const { data: catRow } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    if (catRow?.id) {
      query = query.eq("category_id", catRow.id);
    }
  }

  // ── Filter: Stock ──
  if (stockFilter === "in_stock") {
    query = query.gt("available_qty", 5);
  } else if (stockFilter === "low_stock") {
    query = query.gte("available_qty", 1).lte("available_qty", 5);
  } else if (stockFilter === "out_of_stock") {
    query = query.eq("available_qty", 0);
  }

  // ── Filter: Price Range ──
  if (minPrice) query = query.gte("sale_price", parseInt(minPrice));
  if (maxPrice) query = query.lte("sale_price", parseInt(maxPrice));

  // ── Sorting ──
  if (sortValue === "price-asc") query = query.order("sale_price", { ascending: true });
  else if (sortValue === "price-desc") query = query.order("sale_price", { ascending: false });
  else if (sortValue === "newest") query = query.order("created_at", { ascending: false });
  else if (sortValue === "oldest") query = query.order("created_at", { ascending: true });
  else query = query.order("name", { ascending: sortValue !== "name-desc" });

  // ── Pagination ──
  const { data: rawProducts, count: totalCount } = await query.range(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage - 1
  );

  // 4. Compute ratings per product, then apply rating filter client-side
  let products = (rawProducts || []).map((p) => {
    const reviewList: { rating: number }[] = p.product_reviews || [];
    const reviewCount = reviewList.length;
    const avgRating =
      reviewCount > 0
        ? reviewList.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
        : 0;
    const originalPrice = p.mrp || p.sale_price || 0;
    const salePrice = p.sale_price || null;
    const isActuallyOnSale = salePrice !== null && Number(salePrice) < Number(originalPrice);

    return {
      ...p,
      id: p.id,
      name: p.name,
      sku: p.id,
      price: originalPrice,
      specialPrice: isActuallyOnSale ? salePrice : null,
      minimumPrice: isActuallyOnSale ? salePrice : null,
      urlKey: p.slug || p.id,
      baseImageUrl: p.image_url,
      isSaleable: p.stock_status === "ACTIVE" && (p.available_qty || 0) > 0,
      rating: Math.round(avgRating),
      reviewCount,
      priceHtml: { currencyCode: "PKR" },
    };
  });

  // Apply rating filter (post-fetch since it's computed from reviews)
  if (ratingFilter) {
    const minRating = parseInt(ratingFilter);
    products = products.filter((p) => p.rating >= minRating);
  }

  const filterAttributes = [
    {
      id: "categories",
      code: "category",
      adminName: "Categories",
      options: sidebarCategories.map(c => ({ id: c.slug, adminName: c.title }))
    },
    {
      id: "stock",
      code: "stock",
      adminName: "Availability",
      options: [
        { id: "in_stock", adminName: "In Stock" },
        { id: "low_stock", adminName: "Low Stock" },
        { id: "out_of_stock", adminName: "Out of Stock" }
      ]
    }
  ];

  return (
    <main className="max-w-[1440px] mx-auto bg-background text-foreground min-h-screen">
      {/* Hero Banner Section */}
      <section className="px-4 md:px-12 py-6 md:py-8 isolate">
        <div className="relative bg-[#e6f3f0] dark:bg-emerald-950/20 rounded-2xl md:rounded-[2rem] overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center p-6 md:p-16">
          <div className="max-w-md relative z-10 text-center md:text-left mx-auto md:mx-0">
            <h1 className="text-2xl md:text-5xl font-headline font-bold text-stone-900 dark:text-stone-100 mb-4">
              Gifts and Treasures for the Discerning
            </h1>
            <p className="text-stone-700 dark:text-stone-300 font-body text-sm md:text-base leading-relaxed mb-6">
              Curated collections that define modern luxury. From ancestral timepieces to
              architectural audio, discover pieces designed to be cherished for generations.
            </p>
          </div>
          {/* Hero Product Images */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center pointer-events-none">
            <img
              alt="Luxury Item"
              className="absolute w-48 h-48 object-cover rounded-xl shadow-lg -rotate-12 translate-x-[-120px] translate-y-[-80px]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp_DOilbmBiePGFqfgS4kI_MqFZHfrvQRZM9Ya-4utlLEf2HmakQBvrcUuYnJDdu_TWCRqRAKoo3zp3X_L6fWyin06sn6QwTMKpkt2fvUZEqwZ5haa_HK4-eLVHbuKK0fryVJxziVLbgjTj8ee_Zr4Mj3O2JUyZk-X41misdx05CcO54gEskwG-C8qe1mOm5Tj042GApoOPL7DU_JK7_v1RKOvLkgSO6KB96Ys9-mWTRGlOKjRMtAvXdlMo15XH10p4zv9Z_8eYxw"
            />
            <img
              alt="Watch"
              className="absolute w-64 h-64 object-cover rounded-xl shadow-2xl z-10"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR3YHVjizvXm-2Fzeep-veC0e4Ug78PdresgIiHk_JJO6nmt4MEdEvGbI62p4EDo2kEey9JwhfQHFzx4VU7MLO7xN3UNkcoU1L9qoz6A6hS9hAjukPp75r8G95X3ZLSYJ466UVgweGjBwvXVBw8l7Hm7BlYHX9OZkgWDR5da2Bfkcob2rHw3r3EkxKjgtKNYzL96CabeeIX_kdyPfhZ0rSe6ngJIM7Z5RFmLRlvG2TDA1uANStYKoB7inj4N1UX6WHtKRP94n70FY"
            />
            <img
              alt="Jewelry"
              className="absolute w-40 h-40 object-cover rounded-xl shadow-lg rotate-6 translate-x-[150px] translate-y-[100px]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCurulL8HhUPcVCXb7jbtYHalpil85Ye6cVpXIl9yqRE-XbeClYyHGuEcob9Xv1zxzlhbqHaiKCR84FvCk-L_2SKASGvULvkX70lZYw68hkRw_t5c5kZ7AiM9x6fMycmeqv9XWg7wrgxs7qAxorPcdOe-gYwnbdDSDZSe5WrHVcLSXmvyHVQ74GuoxyijYHShbR5UvhyfYwBUzHkhtZsQvAJ2vHxsklL_QT2nzjqunuuL_RVDofq4MAZx5a-tmeqZwQ6KnEMI9gRPE"
            />
          </div>
        </div>
      </section>

      {/* Utility Bar */}
      <section className="px-4 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-xs md:text-sm font-medium text-stone-500 order-2 md:order-1">
          Showing <span className="text-foreground font-bold">{products.length}</span> of{" "}
          <span className="text-foreground font-bold">{totalCount}</span> Products
        </span>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto order-1 md:order-2">
          <div className="md:hidden w-full sm:w-auto">
            <MobileFilter filterAttributes={filterAttributes} />
          </div>
          <div className="w-full sm:w-auto flex justify-center">
            <SortOrder title="Sort" sortOrders={SortByFields} />
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 flex flex-col lg:flex-row gap-10 pb-24">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <Suspense fallback={<div className="space-y-3 animate-pulse">{[...Array(4)].map((_,i)=><div key={i} className="h-32 bg-stone-100 dark:bg-stone-800 rounded-xl" />)}</div>}>
              <ShopFilterList
                categories={sidebarCategories}
                priceRange={priceRange}
              />
            </Suspense>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {!isArray(products) || products.length === 0 ? (
            <NotFound
              msg={
                searchValue
                  ? `No products match: "${searchValue}"`
                  : "No products match your current filters."
              }
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              <ProductGridItems products={products} />
            </div>
          )}

          {/* Pagination */}
          {(totalCount || 0) > itemsPerPage && (
            <div className="mt-20 flex justify-center">
              <Pagination
                itemsPerPage={itemsPerPage}
                itemsTotal={totalCount || 0}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
