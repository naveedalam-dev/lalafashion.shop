"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Shield, Lock, Mail, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaText, setCaptchaText] = useState("");
    const [captchaAns, setCaptchaAns] = useState(0);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const supabase = createClient();

    // Generate Math Captcha
    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptchaText(`${num1} + ${num2} = ?`);
        setCaptchaAns(num1 + num2);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // 1. Validate Security Question
        if (securityAnswer !== "92114") {
            setError("Incorrect security protocol answer.");
            setIsLoading(false);
            return;
        }

        // 2. Validate Math Captcha
        if (parseInt(captchaInput) !== captchaAns) {
            setError("Captcha verification failed.");
            generateCaptcha();
            setIsLoading(false);
            return;
        }

        try {
            // 3. Supabase Auth
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // 4. Double check Admin role
            // FAIL-SAFE: If UUID matches the specific admin, grant access even if DB query fails
            const ADMIN_UUID = '7f4b9ea2-620e-45b7-80e4-b66e1ea56579';
            
            if (data.user.id === ADMIN_UUID) {
                // Guaranteed access for our primary admin
            } else {
                const { data: profile, error: profileError } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                if (profileError || profile?.role !== "admin") {
                    await supabase.auth.signOut();
                    setError("Access Denied: You do not have admin privileges.");
                    setIsLoading(false);
                    return;
                }
            }

            // Success
            router.push("/admin-login/dashboard");
            router.refresh();

        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="bg-gray-900 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Terminal</h1>
                    <p className="text-gray-400 text-sm mt-2">Authorization required for access</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Account Identification</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                required
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin Email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Secret Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                required
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>

                    {/* Security Question */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Security Protocol</label>
                        <p className="text-sm text-gray-600 ml-1 mb-1 italic">What is the security?</p>
                        <input 
                            required
                            type="text" 
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            placeholder="Enter security code"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                        />
                    </div>

                    {/* Captcha */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Human Verification</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-100 rounded-xl py-3 px-4 flex items-center justify-between">
                                <span className="font-mono font-bold text-gray-700 tracking-widest">{captchaText}</span>
                                <button type="button" onClick={generateCaptcha} className="text-gray-400 hover:text-blue-500 transition-colors">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                            <input 
                                required
                                type="number" 
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                placeholder="Ans"
                                className="w-20 bg-gray-50 border border-gray-200 rounded-xl py-3 px-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 text-center"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isLoading}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Initiating Access...
                            </>
                        ) : (
                            "Grant Access"
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-4">
                        Secure Environment System v3.1.0
                    </p>
                </form>
            </div>
            
            <p className="mt-8 text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} LALA Fashion Store
            </p>
        </div>
    );
}
