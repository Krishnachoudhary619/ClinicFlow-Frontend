"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types/user";

export default function Navbar() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = () => {
		logout();
		router.replace("/login");
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (!user) return null;

	return (
		<nav className='sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16 items-center'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold'>C</span>
						</div>
						<span className='text-xl font-bold tracking-tight text-slate-900 dark:text-white'>
							ClinicFlow
						</span>
					</div>

					<div className='relative' ref={dropdownRef}>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-all dark:hover:bg-slate-800 focus:ring-2 focus:ring-blue-500/20'>
							<div className='w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-600'>
								<span className='text-sm font-bold text-slate-600 dark:text-slate-300'>
									{user.email.charAt(0).toUpperCase()}
								</span>
							</div>
							<div className='hidden md:block text-left'>
								<p className='text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize'>
									{user.role.toLowerCase()}
								</p>
							</div>
							<svg
								className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</button>

						{isOpen && (
							<div className='absolute right-0 mt-2 w-64 origin-top-right bg-white border border-slate-200 rounded-2xl shadow-xl dark:bg-slate-900 dark:border-slate-800 py-2 animate-in fade-in zoom-in duration-200'>
								<div className='px-4 py-3 border-b border-slate-100 dark:border-slate-800'>
									<p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
										{user.email}
									</p>
									<div className='mt-1 flex items-center gap-2'>
										<span className='px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/30 dark:text-blue-400'>
											{user.role}
										</span>
									</div>
								</div>

								<div className='px-2 py-2'>
									<button
										onClick={handleLogout}
										className='w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors dark:hover:bg-red-900/10'>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth='2'
												d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
											/>
										</svg>
										Sign Out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
