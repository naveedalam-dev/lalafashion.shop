"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import Link from "next/link";
import { createUrl } from "@/utils/helper";

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface ShopFilterListProps {
  categories: Category[];
  priceRange: { min: number; max: number };
}

// ─── Chevron icon ─────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

// ─── Check icon ───────────────────────────────────────────────────────────────
const Check = () => (
  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Collapsible Section ──────────────────────────────────────────────────────
function Section({
  title,
  children,
  open = true,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group" open={open}>
      <summary className="flex items-center justify-between cursor-pointer list-none py-3 select-none">
        <span className="text-[11px] font-bold tracking-[0.12em] text-stone-900 dark:text-stone-200 uppercase">
          {title}
        </span>
        <span className="text-stone-400 group-open:rotate-180 transition-transform duration-200 block">
          <ChevronDown />
        </span>
      </summary>
      <div className="pb-4 pt-1">{children}</div>
    </details>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="border-t border-stone-100 dark:border-stone-800" />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShopFilterList({ categories, priceRange }: ShopFilterListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") || "";
  const activeStock = searchParams.get("stock") || "";
  const activeRating = searchParams.get("rating") || "";
  const urlMin = searchParams.get("minPrice");
  const urlMax = searchParams.get("maxPrice");

  // Price inputs — local state only committed on "Apply"
  const [inputMin, setInputMin] = useState(urlMin || "");
  const [inputMax, setInputMax] = useState(urlMax || "");

  // Keep inputs in sync when URL changes (e.g. Clear All)
  useEffect(() => {
    setInputMin(urlMin || "");
    setInputMax(urlMax || "");
  }, [urlMin, urlMax]);

  // ─── Generic URL param setter ──────────────────────────────────────────────
  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page");
    if (value) p.set(key, value);
    else p.delete(key);
    startTransition(() => router.replace(createUrl(pathname, p), { scroll: false }));
  }

  // ─── Apply price ──────────────────────────────────────────────────────────
  function applyPrice() {
    const p = new URLSearchParams(searchParams.toString());
    p.delete("page");

    const min = parseInt(inputMin);
    const max = parseInt(inputMax);

    if (!isNaN(min) && inputMin !== "") p.set("minPrice", min.toString());
    else p.delete("minPrice");

    if (!isNaN(max) && inputMax !== "") p.set("maxPrice", max.toString());
    else p.delete("maxPrice");

    startTransition(() => router.replace(createUrl(pathname, p), { scroll: false }));
  }

  // ─── Clear all ────────────────────────────────────────────────────────────
  function clearAll() {
    setInputMin("");
    setInputMax("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  }

  const hasActiveFilters = activeCategory || activeStock || activeRating || urlMin || urlMax;

  const STOCK = [
    { id: "in_stock",     label: "In Stock",      dot: "bg-emerald-500" },
    { id: "low_stock",    label: "Low Stock",     dot: "bg-amber-400" },
    { id: "out_of_stock", label: "Out of Stock",  dot: "bg-red-400" },
  ];

  const RATINGS = [
    { value: "4", stars: 4, label: "4 & above" },
    { value: "3", stars: 3, label: "3 & above" },
    { value: "2", stars: 2, label: "2 & above" },
  ];

  return (
    <div className={`transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold tracking-[0.15em] text-stone-900 dark:text-white uppercase">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-[11px] font-semibold text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800 overflow-hidden shadow-sm">
        
        {/* ── Collections ─────────────────────────────────────── */}
        <div className="px-5">
          <Section title="Collections">
            <ul className="space-y-0.5">
              <li>
                <Link
                  href={`${pathname}${activeCategory ? "" : ""}`}
                  onClick={() => setParam("category", null)}
                  className={`flex items-center justify-between w-full py-2 px-2.5 rounded-lg text-sm transition-all ${
                    !activeCategory
                      ? "text-stone-900 dark:text-white font-semibold bg-stone-50 dark:bg-stone-800"
                      : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  <span>All Products</span>
                  {!activeCategory && <Check />}
                </Link>
              </li>
              {categories.map((cat) => {
                const active = activeCategory === cat.slug;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => setParam("category", active ? null : cat.slug)}
                      className={`flex items-center justify-between w-full py-2 px-2.5 rounded-lg text-sm transition-all text-left ${
                        active
                          ? "text-stone-900 dark:text-white font-semibold bg-stone-50 dark:bg-stone-800"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span>{cat.title}</span>
                      {active && <Check />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>

        <Divider />

        {/* ── Price ───────────────────────────────────────────── */}
        <div className="px-5">
          <Section title="Price">
            <div className="space-y-3">
              {/* Range hint */}
              <p className="text-[11px] text-stone-400 dark:text-stone-500">
                Range: Rs {priceRange.min.toLocaleString()} – Rs {priceRange.max.toLocaleString()}
              </p>

              {/* Input row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 font-medium">Rs</span>
                  <input
                    type="number"
                    placeholder={priceRange.min.toString()}
                    value={inputMin}
                    min={priceRange.min}
                    max={priceRange.max}
                    onChange={(e) => setInputMin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPrice()}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <span className="text-stone-300 dark:text-stone-600 text-sm font-light shrink-0">–</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-400 font-medium">Rs</span>
                  <input
                    type="number"
                    placeholder={priceRange.max.toString()}
                    value={inputMax}
                    min={priceRange.min}
                    max={priceRange.max}
                    onChange={(e) => setInputMax(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyPrice()}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Active indicator */}
              {(urlMin || urlMax) && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Rs {urlMin || priceRange.min} – Rs {urlMax || priceRange.max} applied
                </p>
              )}

              {/* Apply button */}
              <button
                onClick={applyPrice}
                className="w-full py-2 text-[12px] font-bold uppercase tracking-widest text-stone-900 dark:text-white border border-stone-900 dark:border-white rounded-lg hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-all duration-200"
              >
                Apply
              </button>
            </div>
          </Section>
        </div>

        <Divider />

        {/* ── Availability ────────────────────────────────────── */}
        <div className="px-5">
          <Section title="Availability">
            <ul className="space-y-0.5">
              {STOCK.map((opt) => {
                const active = activeStock === opt.id;
                return (
                  <li key={opt.id}>
                    <button
                      onClick={() => setParam("stock", active ? null : opt.id)}
                      className={`flex items-center justify-between w-full py-2 px-2.5 rounded-lg text-sm transition-all text-left ${
                        active
                          ? "text-stone-900 dark:text-white font-semibold bg-stone-50 dark:bg-stone-800"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${opt.dot} shrink-0`} />
                        {opt.label}
                      </span>
                      {active && <Check />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>

        <Divider />

        {/* ── Rating ──────────────────────────────────────────── */}
        <div className="px-5">
          <Section title="Rating">
            <ul className="space-y-0.5">
              {RATINGS.map((opt) => {
                const active = activeRating === opt.value;
                return (
                  <li key={opt.value}>
                    <button
                      onClick={() => setParam("rating", active ? null : opt.value)}
                      className={`flex items-center justify-between w-full py-2 px-2.5 rounded-lg text-sm transition-all ${
                        active
                          ? "text-stone-900 dark:text-white font-semibold bg-stone-50 dark:bg-stone-800"
                          : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {/* Stars */}
                        <span className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg
                              key={s}
                              className={`w-3 h-3 ${s <= opt.stars ? "text-amber-400 fill-amber-400" : "text-stone-200 dark:text-stone-700 fill-current"}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </span>
                        <span className="text-[12px]">{opt.label}</span>
                      </span>
                      {active && <Check />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Section>
        </div>

      </div>
    </div>
  );
}
