"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { getFilterAttributeTypes } from "@/types/types";
import { isArray } from "@/utils/type-guards";
import { PAGE, QUERY, SORT } from "@/utils/constants";
import { createUrl } from "@/utils/helper";
import Link from "next/link";
import { CategoryNode } from "@/types/theme/category-tree";

function FilterItemList({
  list,
}: {
  list: getFilterAttributeTypes;
  title: string;
}) {
  const currentParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const selectedFilters = useMemo(
    () => new Set(currentParams.get(list.code)?.split(",") ?? []),
    [list.code, currentParams]
  );

  const handleFilterToggle = (id: string) => {
    const newParams = new URLSearchParams(currentParams.toString());
    const currentSelected = new Set(selectedFilters);
    
    if (currentSelected.has(id)) {
      currentSelected.delete(id);
    } else {
      currentSelected.add(id);
    }

    if (currentSelected.size > 0) {
      newParams.set(list.code, Array.from(currentSelected).join(","));
    } else {
      newParams.delete(list.code);
    }

    const newUrl = createUrl(pathname, newParams);
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="border border-stone-100 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <details className="group" open>
        <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-0 group-open:border-b">
          <span className="font-bold text-sm tracking-wide text-foreground uppercase">
            {list.adminName}
          </span>
          <svg className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="p-6 space-y-4">
          {list.options?.map((option) => (
            <label key={option.id} className="flex items-center justify-between group/item cursor-pointer">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={selectedFilters.has(option.id)}
                  onChange={() => handleFilterToggle(option.id)}
                  className="w-4 h-4 rounded border-stone-300 text-black focus:ring-0 cursor-pointer"
                />
                <span className={`text-sm transition-colors ${
                  selectedFilters.has(option.id) 
                    ? 'text-black dark:text-white font-medium' 
                    : 'text-stone-600 dark:text-stone-400 group-hover/item:text-black dark:group-hover/item:text-white'
                }`}>
                  {option.adminName}
                </span>
              </div>
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}

export default function FilterList({
  filterAttributes,
  categories,
}: {
  filterAttributes: any;
  categories: CategoryNode[];
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentParams = useSearchParams();
  const currentPage = currentParams.get(PAGE) || "1";
  const sort = currentParams.get(SORT) || "name-asc";
  const query = currentParams.get(QUERY) || "";

  const hasActiveFilters = useMemo(() => {
    return Array.from(currentParams.keys()).some(
      (key) => ![PAGE, SORT, QUERY].includes(key)
    );
  }, [currentParams]);

  const handleClearAll = () => {
    const newUrl = pathname;
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Collections Section */}
      {categories && categories.length > 0 && (
        <div className="border border-stone-100 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <details className="group" open>
            <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800 group-open:border-b">
              <span className="font-bold text-sm tracking-wide text-foreground uppercase">
                Collections
              </span>
              <svg className="w-5 h-5 text-stone-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="p-6 pt-4 space-y-1">
              <Link 
                href="/shop"
                className={`block py-1 text-sm font-body transition-colors ${
                  pathname === '/shop' 
                    ? 'text-black dark:text-white font-bold' 
                    : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                }`}
              >
                All Products
              </Link>
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <Link 
                    href={`/category/${category.translation?.slug}`}
                    className={`block py-1 text-sm font-body transition-colors ${
                      pathname === `/category/${category.translation?.slug}`
                        ? 'text-black dark:text-white font-bold' 
                        : 'text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {category.translation?.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <div className="pl-4 space-y-1 border-l border-stone-100 ml-1">
                      {category.children.map((child) => (
                        <Link 
                          key={child.id}
                          href={`/category/${child.translation?.slug}`}
                          className={`block py-1 text-xs font-body transition-colors ${
                            pathname === `/category/${child.translation?.slug}`
                              ? 'text-black font-medium' 
                              : 'text-stone-500 hover:text-black'
                          }`}
                        >
                          {child.translation?.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {filterAttributes?.map((item: any) => {
        const hasOptions = isArray(item.options);
        return hasOptions ? (
          <FilterItemList key={item.id} list={item} title={item?.adminName} />
        ) : null;
      })}

      {hasActiveFilters && (
        <button
          disabled={isPending}
          type="button"
          onClick={handleClearAll}
          className="mt-6 text-xs uppercase tracking-widest font-bold text-stone-400 dark:text-stone-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 py-4 border border-stone-100 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900 shadow-sm"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear All Filters
      </button>
      )}
    </div>
  );
}
