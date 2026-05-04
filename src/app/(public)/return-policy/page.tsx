import { RefreshCcw, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";

export default function ReturnPolicyPage() {
    return (
        <div className="bg-white dark:bg-background min-h-screen font-outfit text-slate-900 dark:text-foreground">
            {/* Hero Header */}
            <header className="relative pt-24 pb-16 overflow-hidden border-b border-slate-100 dark:border-neutral-900">
                <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" style={{ height: "400px" }}></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <RefreshCcw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Refund & Return <span className="text-blue-600">Policy</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-neutral-400 font-normal max-w-2xl leading-relaxed">
                        We ensure that all products listed on our website are 100% original and exactly as shown.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                            Inspection Upon Delivery
                        </h2>
                        <p className="text-slate-600 dark:text-neutral-400 leading-relaxed md:text-sm">
                            Customers may request to <strong>inspect/open the parcel (where applicable)</strong> before final acceptance to ensure satisfaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <RefreshCcw className="w-6 h-6 text-blue-600" />
                            Return Conditions
                        </h2>
                        <p className="text-slate-600 dark:text-neutral-400 leading-relaxed md:text-sm">
                            If a return is requested, the <strong>customer is only responsible for delivery charges</strong>, not the product cost.
                        </p>
                    </section>
                </div>

                {/* Support CTA */}
                <div className="mt-20 p-10 rounded-[3rem] bg-blue-600 text-white text-center shadow-xl shadow-blue-500/20">
                    <h3 className="text-2xl font-bold mb-4">Need to return an item?</h3>
                    <p className="text-blue-100 mb-8 font-medium">Contact our support team to initiate the return process.</p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all font-outfit"
                    >
                        Contact Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
