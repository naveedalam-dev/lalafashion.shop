"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SortOrderTypes } from "@/utils/constants";
import { createUrl } from "@/utils/helper";
import { SORT } from "@/utils/constants";

export default function SortOrder({
  title,
  sortOrders,
}: {
  title: string;
  sortOrders: SortOrderTypes[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const sort = searchParams.get(SORT) || "name-asc";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort) {
      params.set(SORT, newSort);
    } else {
      params.delete(SORT);
    }

    const newUrl = createUrl(pathname, params);
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
        {title}:
      </span>
      <div className="relative group">
        <select 
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="appearance-none border border-stone-200 dark:border-stone-700 rounded-lg py-2 px-4 pr-10 text-sm font-medium focus:ring-0 focus:border-stone-400 outline-none bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 cursor-pointer transition-colors"
        >
          {sortOrders.map((order) => (
            <option key={order.key} value={order.key}>
              {order.title}
            </option>
          ))}
        </select>
        <svg 
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
