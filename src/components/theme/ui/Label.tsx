import clsx from "clsx";
import { LeftArrow } from "@components/common/icons/LeftArrow";
import { Price } from "./Price";

const Label = ({
  title,
  amount,
  originalAmount,
  currencyCode,
  page,
  position = "bottom",
}: {
  title: string;
  amount: string;
  originalAmount?: string;
  page?: string;
  currencyCode: string;
  position?: "bottom" | "center" | "left";
}) => {
  return (
    <div
      className={clsx("absolute w-fit px-2 sm:px-4", {
        "bottom-2 sm:bottom-4": position === "center",
        "bottom-0 pb-3 md:pb-4": position === "bottom",
        "bottom-2 sm:bottom-4 left-0": position === "left",
      })}
    >
      <div
        className={`flex gap-2 items-center rounded-full border border-neutral-200 bg-white/80 text-xs font-medium text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/80 dark:text-white ${
          page === "category"
            ? "px-3 py-2 lg:px-4 lg:py-2.5"
            : "px-2 py-1.5 sm:px-3 sm:py-2 lg:px-3.5 lg:py-2"
        }`}
      >
        <p
          className={`line-clamp-1 font-semibold leading-none tracking-tight ${clsx(
            page === "category"
              ? "text-sm md:text-lg"
              : "text-xs md:text-sm"
          )}`}
        >
          {title}
        </p>
        {page === "category" ? (
          <button
            aria-label="Go back"
            className="cursor-pointer rounded-full bg-blue-600 p-1.5 md:p-2 transition-transform duration-300 hover:translate-x-1"
          >
            <LeftArrow />
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            {originalAmount && originalAmount !== amount && (
              <Price
                amount={originalAmount}
                className="flex-none text-[10px] md:text-[11px] text-neutral-500 line-through decoration-neutral-400"
                currencyCode={currencyCode}
              />
            )}
            <Price
              amount={amount}
              className={`flex-none rounded-full px-2 py-0.5 text-[11px] md:text-xs font-bold text-white shadow-sm ${originalAmount && originalAmount !== amount ? 'bg-[#00c853]' : 'bg-blue-600'}`}
              currencyCode={currencyCode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Label;
