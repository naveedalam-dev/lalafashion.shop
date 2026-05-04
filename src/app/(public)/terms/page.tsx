import { ScrollText, FileCheck } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-white dark:bg-background min-h-screen font-outfit text-slate-900 dark:text-foreground">
            {/* Hero Header */}
            <header className="relative pt-24 pb-16 overflow-hidden border-b border-slate-100 dark:border-neutral-900">
                <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" style={{ height: "400px" }}></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                        <ScrollText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Terms & <span className="text-purple-600">Conditions</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-neutral-400 font-normal max-w-2xl leading-relaxed">
                        By using our website, you agree to the following terms.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <FileCheck className="w-6 h-6 text-purple-600" />
                            Agreement Terms
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
                            <li>All products are sold as displayed with accurate descriptions</li>
                            <li>Customers must provide correct delivery information</li>
                            <li>Orders cannot be cancelled after dispatch</li>
                            <li>Returns are subject to the stated return policy</li>
                            <li>LALA FASHION reserves the right to update policies without prior notice</li>
                        </ul>
                    </section>
                </div>

                {/* Support CTA */}
                <div className="mt-20 p-10 rounded-[3rem] bg-purple-600 text-white text-center shadow-xl shadow-purple-500/20">
                    <h3 className="text-2xl font-bold mb-4">Questions about our Terms?</h3>
                    <p className="text-purple-100 mb-8 font-medium">Reach out to our team for any clarifications.</p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-10 py-4 bg-white text-purple-600 font-bold rounded-2xl hover:bg-purple-50 transition-all font-outfit"
                    >
                        Talk to Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
