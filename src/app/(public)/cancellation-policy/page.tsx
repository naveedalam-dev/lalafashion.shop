import { XCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function CancellationPolicyPage() {
    return (
        <div className="bg-white dark:bg-background min-h-screen font-outfit text-slate-900 dark:text-foreground">
            {/* Hero Header */}
            <header className="relative pt-24 pb-16 overflow-hidden border-b border-slate-100 dark:border-neutral-900">
                <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" style={{ height: "400px" }}></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                    <div className="mb-6 inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                        <XCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                        Cancellation <span className="text-blue-600">Policy</span>
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-neutral-400 font-normal max-w-2xl leading-relaxed">
                        Important information regarding the cancellation of your orders.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-blue-600" />
                            Order Cancellation Terms
                        </h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-neutral-400 leading-relaxed md:text-sm">
                            <li>Orders can be <strong>cancelled only before dispatch</strong>.</li>
                            <li>Once the order has been shipped, cancellation is <strong>not possible</strong>.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            Order Tracking
                        </h2>
                        <p className="text-slate-600 dark:text-neutral-400 leading-relaxed md:text-sm">
                            Customers can track their order status to know if it has been dispatched here:<br/>
                            <Link href="/track-order" className="text-blue-600 hover:underline">https://www.lalafashion.store/track-order</Link>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            Cancellation Request Channels
                        </h2>
                        <ul className="list-none space-y-3 mt-4">
                            <li className="flex items-center gap-3 text-slate-600 dark:text-neutral-400 md:text-sm">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <strong>Email:</strong> <a href="mailto:support@lalafashion.store" className="text-blue-600 hover:underline">support@lalafashion.store</a>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600 dark:text-neutral-400 md:text-sm">
                                <Phone className="w-5 h-5 text-blue-600" />
                                <strong>WhatsApp:</strong> +92 339 2255235
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Support CTA */}
                <div className="mt-20 p-10 rounded-[3rem] bg-blue-600 text-white text-center shadow-xl shadow-blue-500/20">
                    <h3 className="text-2xl font-bold mb-4">Need to cancel your order?</h3>
                    <p className="text-blue-100 mb-8 font-medium">Contact our support team immediately before dispatch.</p>
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all font-outfit"
                    >
                        Talk to Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
