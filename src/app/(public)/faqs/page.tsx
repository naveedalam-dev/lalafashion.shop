"use client";

import { useState } from "react";
import { Plus, Minus, FileText } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        question: "Delivery kitne din me hoti hai?",
        answer: "Delivery usually 3 to 5 working days me ho jati hai."
    },
    {
        question: "Kya product same hota hai jo website par dikhaya jata hai?",
        answer: "Ji haan, hum 100% same product deliver karte hain (design, color, size, brand)."
    },
    {
        question: "Kya parcel open karke check kar sakte hain?",
        answer: "Haan, jahan applicable ho wahan inspection allowed hoti hai."
    },
    {
        question: "Return policy kya hai?",
        answer: "Customer sirf delivery charges pay karega, product cost refund ho jati hai (conditions apply)."
    },
    {
        question: "Order cancel kaise karein?",
        answer: "Dispatch se pehle WhatsApp ya email ke through cancel kar sakte hain."
    },
    {
        question: "Order track kaise karein?",
        answer: "https://www.lalafashion.store/track-order"
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white dark:bg-background min-h-screen font-outfit text-slate-900 dark:text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map((faq) => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                            }
                        }))
                    })
                }}
            />
            {/* Hero Header */}
            <header className="relative pt-24 pb-16 overflow-hidden">
                {/* Dot pattern overlay */}
                <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" style={{ height: "400px" }}></div>
                
                <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Frequently Asked Questions <span className="text-slate-400 dark:text-neutral-500 font-medium">(FAQs)</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-500 dark:text-neutral-400 font-normal max-w-2xl leading-relaxed">
                        Find answers to the most frequently asked questions about our products and services.
                    </p>
                </div>
            </header>

            {/* FAQ Section */}
            <main className="max-w-3xl mx-auto px-6 pb-32">
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div 
                                key={index} 
                                className={`group rounded-2xl transition-all duration-300 ${
                                    isOpen 
                                        ? "bg-slate-50 dark:bg-neutral-900/50 p-6 shadow-sm border border-slate-100 dark:border-neutral-800" 
                                        : "border-b border-slate-100 dark:border-neutral-900 py-6 px-6 hover:bg-slate-50/50 dark:hover:bg-neutral-900/30"
                                }`}
                            >
                                <button 
                                    onClick={() => toggleFaq(index)}
                                    className="flex justify-between items-center w-full text-left focus:outline-none"
                                >
                                    <h3 className={`text-base font-semibold transition-colors duration-300 ${
                                        isOpen ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-neutral-300 group-hover:text-slate-900 dark:group-hover:text-white"
                                    }`}>
                                        {faq.question}
                                    </h3>
                                    <span className={`flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "text-slate-900 dark:text-white rotate-180" : "text-slate-400 dark:text-neutral-600 group-hover:text-slate-600 dark:group-hover:text-neutral-400"}`}>
                                        {isOpen ? (
                                            <Minus className="h-5 w-5" />
                                        ) : (
                                            <Plus className="h-5 w-5" />
                                        )}
                                    </span>
                                </button>
                                
                                <div 
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed max-w-xl">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 pt-16 border-t border-slate-100 dark:border-neutral-900 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-slate-50 dark:bg-neutral-900 rounded-2xl mb-6">
                        <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Still have questions?</h4>
                    <p className="text-slate-500 dark:text-neutral-400 mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-neutral-200 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Get in touch
                    </Link>
                </div>
            </main>
        </div>
    );
}
