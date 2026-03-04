"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function UserDropdown() {
	const { user, logout } = useAuthStore();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleLogout = () => {
		setIsLogoutModalOpen(false);
		logout();
		router.replace("/login");
	};

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
		<>
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
						<p className='text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize leading-none mb-0.5'>
							{user.role.toLowerCase()}
						</p>
						<p className='text-xs font-black text-slate-900 dark:text-white leading-none max-w-[120px] truncate'>
							{user.email.split("@")[0]}
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
					<div className='absolute right-0 mt-3 w-64 origin-top-right bg-white border border-slate-200 rounded-2xl shadow-xl dark:bg-slate-900 dark:border-slate-800 py-2 animate-in fade-in zoom-in duration-200'>
						<div className='px-4 py-3 border-b border-slate-100 dark:border-slate-800'>
							<p className='text-sm font-medium text-slate-900 dark:text-white truncate'>
								{user.email}
							</p>

							<div className='mt-1 flex items-center gap-2'>
								<span className='px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/30 dark:text-blue-400'>
									{user.role}
								</span>
								<span className='px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-md dark:bg-slate-800 dark:text-slate-400'>
									ID: {user.clinicId}
								</span>
							</div>
						</div>

						<div className='px-2 py-2'>
							<button
								onClick={() => {
									setIsOpen(false);
									setIsLogoutModalOpen(true);
								}}
								className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors dark:hover:bg-rose-900/10'>
								Sign Out
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Modal rendered outside dropdown */}
			<ConfirmModal
				open={isLogoutModalOpen}
				title='Sign Out?'
				description='Are you sure you want to sign out of your account? You will need to log in again to manage the queue.'
				confirmText='Sign Out'
				onConfirm={handleLogout}
				onCancel={() => setIsLogoutModalOpen(false)}
				variant='danger'
			/>
		</>
	);
}
