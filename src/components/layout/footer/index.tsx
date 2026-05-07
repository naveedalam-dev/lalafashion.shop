import Link from "next/link";
import { Suspense } from "react";
import { isObject } from "@/utils/type-guards";
import { getThemeCustomization } from "@/utils/bagisto";
import LogoIcon from "@components/common/icons/LogoIcon";
import FaceBookIcon from "@components/common/icons/social-icon/FaceBookIcon";
import InstaGramIcon from "@components/common/icons/social-icon/InstaGramIcon";
import TwitterIcon from "@components/common/icons/social-icon/TwitterIcon";
import Subscribe from "./Subscribe";
import FooterMenu from "./FooterMenu";
import ServiceContent from "./ServiceContent";
import TikTokIcon from "@components/common/icons/social-icon/TikTokIcon";
import ThreadsIcon from "@components/common/icons/social-icon/ThreadsIcon";
import { ThemeCustomizationTranslationEdge } from "@/types/theme/theme-customization";
const { COMPANY_NAME, SITE_NAME } = process.env;
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2010 + (currentYear > 2010 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700";
  const menu = await getThemeCustomization();
  const copyrightName = COMPANY_NAME || SITE_NAME || "";
  const services =
    menu?.services_content?.themeCustomizations?.edges?.[0]?.node;

  return (
    <>
      {isObject(services) && services?.translations?.edges && (
        <ServiceContent
          name={services?.name}
          serviceData={services?.translations?.edges?.map(
            (edge: ThemeCustomizationTranslationEdge) => edge.node,
          )}
        />
      )}
      <style>
        {`
              @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
              .prebuilt-ui-footer-wrapper, .prebuilt-ui-footer-wrapper * {
                  font-family: "Geist", sans-serif;
              }
          `}
      </style>
      <div className='lala-fashion-footer-wrapper bg-white dark:bg-background pt-20 transition-colors duration-300'>
        <footer className="bg-neutral-100 dark:bg-neutral-900 w-full text-black dark:text-white pt-8 lg:pt-12 px-4 sm:px-8 md:px-16 lg:px-28 rounded-tl-[3rem] rounded-tr-[3rem] overflow-hidden transition-colors duration-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8 md:gap-12">

            <div className="lg:col-span-3 space-y-6">
              <Link href="/" aria-label="Go to homepage">
                <LogoIcon />
              </Link>
              <p className="text-sm/6 text-neutral-600 dark:text-neutral-400 max-w-96 transition-colors duration-300">Modern Lifestyle — LALA Fashion is Pakistan's premier destination for high-quality watches, stylish glasses, exquisite jewellery, and the latest electronics.</p>
              <div className="flex items-center gap-5 md:gap-6 order-1 md:order-2">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/lalafashion.shp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity duration-300"
                >
                  <InstaGramIcon className="w-6 h-6 object-contain" />
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@lalafashion.shp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity duration-300"
                >
                  <TikTokIcon className="w-6 h-6 object-contain" />
                </a>

                {/* X (Twitter) */}
                <a 
                  href="https://x.com/lalafashion_shp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity duration-300"
                >
                  <TwitterIcon className="w-6 h-6 object-contain" />
                </a>

                {/* Threads */}
                <a 
                  href="https://www.threads.com/@lalafashion.shp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity duration-300"
                >
                  <ThreadsIcon className="w-6 h-6 object-contain" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-12 items-start mt-8 lg:mt-0">
              {/* Shop */}
              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-neutral-200 transition-colors duration-300">Shop</h3>
                <ul className="space-y-3 text-sm text-neutral-800 dark:text-neutral-400 transition-colors duration-300">
                  <li><Link href="/shop" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Shop</Link></li>
                  <li><Link href="/category/watches" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Watches</Link></li>
                  <li><Link href="/category/glasses" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Glasses</Link></li>
                  <li><Link href="/category/jewellery" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Jewellery</Link></li>
                  <li><Link href="/category/electronics" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Electronics</Link></li>
                </ul>
              </div>
              {/* Support */}
              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-neutral-200 transition-colors duration-300">Support</h3>
                <ul className="space-y-3 text-sm text-neutral-800 dark:text-neutral-400 transition-colors duration-300">
                  <li><Link href="/faqs" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">FAQs</Link></li>
                  <li><Link href="/contact" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Contact Us</Link></li>
                  <li><Link href="/track-order" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Track Order</Link></li>
                  <li><Link href="/about" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">About Us</Link></li>
                </ul>
              </div>

              {/* Policies */}
              <div>
                <h3 className="font-medium text-sm mb-4 dark:text-neutral-200 transition-colors duration-300">Policies</h3>
                <ul className="space-y-3 text-sm text-neutral-800 dark:text-neutral-400 transition-colors duration-300">
                  <li><Link href="/terms" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Terms & Conditions</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Disclaimer</Link></li>
                  <li><Link href="/privacy-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Privacy Policy</Link></li>
                  <li><Link href="/return-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Refund & Return Policy</Link></li>
                  <li><Link href="/shipment-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Delivery Policy</Link></li>
                  <li><Link href="/cancellation-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Cancellation Policy</Link></li>
                  <li><Link href="/data-policy" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-300">Data Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-4 border-t border-neutral-300 dark:border-neutral-800 flex justify-between items-center z-10 relative transition-colors duration-300">
            <p className="text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-300">© {currentYear} LalaFashion Design</p>
            <p className='text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300'>All right reserved.</p>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-slate-100 dark:bg-slate-900 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
            <div className="flex items-center justify-center h-[12rem] sm:h-[16rem] md:h-[20rem] lg:h-[24rem]">
              <TextHoverEffect text="LALA Fashion" />
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
