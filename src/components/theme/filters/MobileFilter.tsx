"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Select, SelectItem } from "@heroui/select";
import { SORT, PAGE, QUERY } from "@/utils/constants";
import { createUrl } from "@/utils/helper";

export default function MobileFilter({
  filterAttributes,
}: {

  filterAttributes: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [tempFilters, setTempFilters] = useState<Record<string, Set<string>>>(
    {}
  );

  useEffect(() => {
    if (isOpen) {
      const initialFilters: Record<string, Set<string>> = {};
      filterAttributes.forEach((attr: any) => {
        const values = searchParams.get(attr.code)?.split(",") || [];
        initialFilters[attr.code] = new Set(values.filter(Boolean));
      });
      //eslint-disable-next-line  
      setTempFilters(initialFilters);
    }
  }, [isOpen, filterAttributes, searchParams]);

  const handleFilterChange = (code: string, keys: Set<string>) => {
    setTempFilters((prev) => ({
      ...prev,
      [code]: keys,
    }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(tempFilters).forEach(([code, values]) => {
      if (values.size > 0) {
        newParams.set(code, Array.from(values).join(","));
      } else {
        newParams.delete(code);
      }
    });

    newParams.delete(PAGE);

    const newUrl = createUrl(pathname, newParams);
    router.replace(newUrl);
    onOpenChange();
  };

  const clearAllFilters = () => {
    const q = searchParams.get(QUERY);
    const sort = searchParams.get(SORT);
    const newParams = new URLSearchParams();

    if (q) newParams.set(QUERY, q);
    if (sort) newParams.set(SORT, sort);

    router.replace(createUrl(pathname, newParams));
    onOpenChange();
  };

  const formatLabel = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <>
      <div className="w-full">
        <Button
          size="lg"
          className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-headline font-bold uppercase tracking-widest text-xs h-14 rounded-xl"
          onPress={() => onOpen()}
        >
          <span className="material-symbols-outlined mr-2">tune</span>
          Filter & Refine
        </Button>
      </div>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <DrawerContent className="rounded-t-[32px] dark:bg-neutral-900">
          {(_onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 pb-4 pt-4 border-b border-stone-100 dark:border-stone-800">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-stone-200 dark:bg-stone-700 mb-4" />
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-headline font-bold text-stone-900 dark:text-stone-100 uppercase tracking-tight">Filter & Refine</h2>
                  <button
                    onClick={onOpenChange}
                    className="material-symbols-outlined text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  >
                    close
                  </button>
                </div>
              </DrawerHeader>
              <DrawerBody className="px-6 py-8 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col gap-10">
                  {filterAttributes?.map((attr: any) => (
                    <div key={attr.id} className="flex flex-col gap-4">
                      <p className="font-headline font-bold text-xs uppercase tracking-widest text-stone-400">
                        {attr.adminName}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {attr.options?.map((option: any) => {
                          const isSelected = tempFilters[attr.code]?.has(option.id);
                          return (
                            <button
                              key={option.id}
                              onClick={() => {
                                const newSet = new Set(tempFilters[attr.code] || []);
                                if (newSet.has(option.id)) newSet.delete(option.id);
                                else newSet.add(option.id);
                                handleFilterChange(attr.code, newSet);
                              }}
                              className={`py-3 px-4 rounded-xl border text-sm font-body transition-all text-left ${
                                isSelected 
                                  ? 'bg-stone-900 border-stone-900 text-white dark:bg-white dark:border-white dark:text-stone-900 shadow-lg' 
                                  : 'border-stone-100 bg-stone-50 text-stone-600 dark:bg-stone-800/50 dark:border-stone-800 dark:text-stone-400'
                              }`}
                            >
                              {option.adminName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 flex flex-col gap-4">
                  <Button
                    className="w-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-headline font-bold uppercase tracking-widest text-xs h-14 rounded-xl"
                    onPress={applyFilters}
                  >
                    Show Results
                  </Button>
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 text-xs uppercase tracking-widest font-bold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
