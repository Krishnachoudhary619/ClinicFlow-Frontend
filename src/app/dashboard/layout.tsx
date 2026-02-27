"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			router.replace("/login");
		}
	}, [isInitialized, isAuthenticated, router]);

	if (!isInitialized || !isAuthenticated) {
		return null; // prevent flash during initialization
	}

	return (
		<div className='flex min-h-screen bg-slate-50 dark:bg-slate-950'>
			{/* Desktop Sidebar */}
			<div className='hidden md:block sticky top-0 h-screen'>
				<Sidebar />
			</div>

			{/* Mobile Sidebar Overlay */}
			{mobileOpen && (
				<div className='fixed inset-0 z-[100] md:hidden'>
					<div
						className='fixed inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300'
						onClick={() => setMobileOpen(false)}
					/>

					<div className='relative w-64 h-full animate-in slide-in-from-left duration-300'>
						<Sidebar />
						<button
							onClick={() => setMobileOpen(false)}
							className='absolute top-4 -right-12 p-2 bg-white rounded-xl shadow-xl dark:bg-slate-900'>
							<svg
								className='w-6 h-6'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				</div>
			)}

			{/* Main Application Area */}
			<div className='flex-1 flex flex-col min-w-0'>
				<Topbar onMenuClick={() => setMobileOpen(true)} />

				<main className='flex-1 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500'>
					{children}
				</main>
			</div>
		</div>
	);
}
