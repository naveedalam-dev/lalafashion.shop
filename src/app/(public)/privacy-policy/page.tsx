import { Lock, EyeOff, Shield, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white dark:bg-background min-h-screen font-outfit text-slate-900 dark:text-foreground">
            {/* Hero Header */}
            <header className="relative pt-24 pb-16 overflow-hidden border-b border-slate-100 dark:border-neutral-900">
                <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" style={{ height: "400px" }}></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                        <Lock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Privacy <span className="text-emerald-600">Policy</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-neutral-400 font-normal max-w-2xl leading-relaxed">
                        At LALA FASHION, we value customer privacy and ensure that all personal information is handled securely.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                    {/* Information Collection */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <EyeOff className="w-6 h-6 text-emerald-600" />
                            Information We Collect
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-neutral-400 text-sm md:text-base">
                            <li>Name, phone number, email address, delivery address</li>
                            <li>Additional delivery-related details (e.g., landmarks, alternate numbers)</li>
                        </ul>
                    </section>

                    {/* How we use it */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-emerald-600" />
                            Usage of Information
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-neutral-400 text-sm md:text-base">
                            <li>Order processing and delivery</li>
                            <li>Customer support and communication</li>
                            <li>Improving our services</li>
                        </ul>
                    </section>

                    {/* Data Protection */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <Database className="w-6 h-6 text-emerald-600" />
                            Data Protection
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-neutral-400 text-sm md:text-base">
                            <li>Customer data is <strong>not shared, sold, or misused</strong></li>
                            <li>Information is only used for order fulfillment and service purposes</li>
                        </ul>
                    </section>
                </div>

                {/* Privacy Contact */}
                <div className="mt-20 p-8 rounded-[2rem] bg-emerald-50 dark:bg-neutral-900 border border-emerald-100 dark:border-neutral-800 text-center text-sm">
                    <h3 className="text-xl font-bold mb-2">Privacy Questions?</h3>
                    <p className="text-slate-500 dark:text-neutral-400 mb-6 font-medium">Your data rights are important to us. Contact us for any privacy-related concerns.</p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
                    >
                        Contact Privacy Team &rarr;
                    </Link>
                </div>
            </main>
        </div>
    );
}
