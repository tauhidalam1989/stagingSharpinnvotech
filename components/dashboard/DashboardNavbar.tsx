'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';

export default function DashboardNavbar() {
    const { user, logout } = useAuth();
    const params = useParams();
    const lang = params.lang as string;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 flex items-center px-8 sticky top-0 z-50">
            <div className="flex items-center gap-4 flex-grow">
                <div className="relative w-80 max-w-full">
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                    <input 
                        type="text" 
                        placeholder="Search dashboard..." 
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1200ff]/10 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div 
                    ref={dropdownRef}
                    className="relative py-3"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="flex flex-col items-end px-1">
                            <p className="text-xs font-black text-zinc-900 dark:text-white leading-none mb-1">{user?.name || 'Administrator'}</p>
                            <p className="text-[9px] font-bold text-[#1200ff] uppercase tracking-wider">{user?.role?.replace('_', ' ') || 'Admin'}</p>
                        </div>
                        <div className="relative">
                            <div className={`absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#1200ff] rounded-xl blur transition duration-500 ${isDropdownOpen ? 'opacity-30' : 'opacity-10'}`}></div>
                            <div className={`relative w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md text-zinc-800 dark:text-white font-black text-base transition-transform duration-300 ${isDropdownOpen ? 'scale-105' : ''}`}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase() || 'A'
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bridge for hover stability */}
                    <div className="absolute top-full left-0 w-full h-2 bg-transparent"></div>

                    {/* Dropdown Menu */}
                    <div className={`absolute top-[calc(100%-4px)] right-0 w-56 bg-white dark:bg-zinc-900 rounded-[20px] shadow-xl shadow-blue-900/10 border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-all duration-300 transform origin-top-right ${isDropdownOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}>
                        <div className="p-3 bg-gradient-to-r from-[#00f2fe]/5 to-[#1200ff]/5 border-b border-zinc-50 dark:border-zinc-800">
                            <p className="text-zinc-400 text-[8px] font-black uppercase tracking-widest mb-0.5">Signed in as</p>
                            <p className="text-zinc-900 dark:text-white font-black text-xs truncate">{user?.email || 'admin@example.com'}</p>
                        </div>
                        
                        <div className="p-1.5">
                            <Link 
                                href={`/${lang}/dashboard/profile`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-gradient-to-r hover:from-[#00f2fe] hover:to-[#1200ff] hover:text-white transition-all duration-300 font-bold text-xs group/item"
                            >
                                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                                    <i className="fas fa-user-circle text-sm"></i>
                                </div>
                                <span className="flex-grow">My Profile</span>
                                <i className="fas fa-chevron-right text-[8px] opacity-0 group-hover/item:opacity-100 transform translate-x-[-2px] group-hover/item:translate-x-0 transition-all"></i>
                            </Link>

                            <Link 
                                href={`/${lang}/dashboard/settings`}
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-gradient-to-r hover:from-[#00f2fe] hover:to-[#1200ff] hover:text-white transition-all duration-300 font-bold text-xs group/item"
                            >
                                <div className="w-7 h-7 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover/item:bg-white/20 transition-colors">
                                    <i className="fas fa-cog text-sm"></i>
                                </div>
                                <span className="flex-grow">Settings</span>
                                <i className="fas fa-chevron-right text-[8px] opacity-0 group-hover/item:opacity-100 transform translate-x-[-2px] group-hover/item:translate-x-0 transition-all"></i>
                            </Link>

                            <div className="h-px bg-zinc-50 dark:bg-zinc-800 my-1.5 mx-3"></div>

                            <button 
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300 font-bold text-xs group/item"
                            >
                                <div className="w-7 h-7 rounded-lg bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                                    <i className="fas fa-sign-out-alt text-sm"></i>
                                </div>
                                <span className="flex-grow text-left">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
