"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, Menu, Plus, Download, Moon, Sun, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Simple hook to close dropdowns on outside click
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
}

export default function Header() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        fetchInitialNotifications();

        // Subscribe to NEW orders
        const channel = supabase
            .channel('admin_notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    const newOrder = payload.new;
                    const notification = {
                        id: newOrder.id,
                        order_number: newOrder.order_number,
                        customer: newOrder.shipping_address ? newOrder.shipping_address.split(',')[0] : 'Guest',
                        amount: newOrder.total_amount,
                        created_at: newOrder.created_at,
                        is_new: true
                    };
                    setNotifications(prev => [notification, ...prev].slice(0, 10));
                    setHasUnread(true);
                    
                    // Optional: Play sound or toast
                    if (typeof window !== "undefined") {
                         // new Audio('/notification.mp3').play().catch(() => {}); 
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchInitialNotifications = async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('id, order_number, shipping_address, total_amount, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        if (!error && data) {
            const formatted = data.map(o => ({
                id: o.id,
                order_number: o.order_number,
                customer: o.shipping_address ? o.shipping_address.split(',')[0] : 'Guest',
                amount: o.total_amount,
                created_at: o.created_at,
                is_new: false
            }));
            setNotifications(formatted);
        }
    };

    const notifRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useOutsideClick(notifRef, () => setShowNotifications(false));
    useOutsideClick(userRef, () => setShowUserMenu(false));

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push("/admin-login");
            router.refresh(); // Clear server segments
        } else {
            console.error("Error signing out:", error.message);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSecs = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSecs < 60) return "Just now";
        if (diffInSecs < 3600) return `${Math.floor(diffInSecs / 60)} mins ago`;
        if (diffInSecs < 86400) return `${Math.floor(diffInSecs / 3600)} hours ago`;
        return date.toLocaleDateString();
    };

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#e5e5e5] dark:border-gray-800 bg-[#f6f6f7] dark:bg-[#09090b] px-4 md:px-8 transition-colors">
            {/* Left side: Mobile Menu Toggle + Global Search */}
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden p-1.5 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md">
                    <Menu className="h-5 w-5" />
                </button>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search products, orders, users... (Press '/')"
                        className="h-8 w-full rounded-md border border-[#c9c9c9] dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white pl-8 pr-3 text-sm shadow-inner-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-400 dark:focus:border-gray-600 dark:focus:ring-gray-600"
                    />
                </div>
            </div>

            {/* Right side: Quick Actions, Theme, Notifications, User */}
            <div className="flex items-center gap-3">
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center gap-2 mr-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-[#c9c9c9] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md shadow-sm transition-colors">
                        <Download className="h-3.5 w-3.5" />
                        <span>Export CSV</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 dark:bg-blue-600 hover:bg-gray-800 dark:hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Product</span>
                    </button>
                </div>

                {/* Theme Toggle (Placeholder) */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                >
                    {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setHasUnread(false);
                        }}
                        className="relative p-1.5 text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        {hasUnread && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-gray-900 animate-pulse"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">Recent Orders</span>
                                <button 
                                    onClick={() => setNotifications(notifications.map(n => ({...n, is_new: false})))}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Mark all read
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <Link 
                                            key={notif.id}
                                            href="/admin-login/orders" 
                                            onClick={() => setShowNotifications(false)}
                                            className={cn(
                                                "block p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 transition-colors",
                                                notif.is_new && "bg-blue-50/50 dark:bg-blue-900/10"
                                            )}
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    <span className="font-bold text-blue-600 dark:text-blue-400">{notif.order_number}</span> placed by <span className="font-semibold">{notif.customer}</span>.
                                                </p>
                                                {notif.is_new && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1"></span>}
                                            </div>
                                            <div className="flex justify-between items-center mt-1.5">
                                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Rs {notif.amount}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{formatTimeAgo(notif.created_at)}</p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        No recent orders
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center">
                                <Link href="/admin-login/orders" className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">View all orders</Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="relative h-8 w-8 rounded-full overflow-hidden border border-[#d4d4d4] dark:border-gray-700 shadow-sm flex items-center justify-center bg-white dark:bg-gray-800 transition-transform hover:scale-105 outline-none focus:ring-2 focus:ring-black ml-1"
                    >
                        <Image src="/Favicon.png" alt="Admin Profile" className="object-cover" fill sizes="32px" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Store Administrator</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@lala-fashion.com</p>
                            </div>
                            <div className="p-1.5">
                                <Link href="/admin-login/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
                                    <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    My Profile
                                </Link>
                                <Link href="/admin-login/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
                                    <Settings className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    Store Settings
                                </Link>
                            </div>
                            <div className="p-1.5 border-t border-gray-100 dark:border-gray-800">
                                <button 
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4 text-red-500" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

