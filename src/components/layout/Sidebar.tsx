"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/user";

const navItems = [
	{
		label: "Dashboard",
		href: "/dashboard",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
				/>
			</svg>
		),
	},
	{
		label: "Analytics",
		href: "/dashboard/analytics",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
				/>
			</svg>
		),
	},
];

export default function Sidebar() {
	const pathname = usePathname();
	const user = useAuthStore((s) => s.user);

	return (
		<aside className='flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 h-full'>
			<div className='p-6 flex items-center gap-3 border-b border-slate-800/50'>
				<div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20'>
					<span className='text-white font-black'>C</span>
				</div>
				<span className='text-xl font-black tracking-tight text-white'>ClinicFlow</span>
			</div>

			<div className='flex-1 py-6 px-4 space-y-8 overflow-y-auto'>
				<div>
					<p className='px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4'>
						Main Navigation
					</p>
					<nav className='space-y-1.5'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={clsx(
									"flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all",
									pathname === item.href
										? "bg-slate-800 text-white"
										: "text-slate-400 hover:bg-slate-800 hover:text-white",
								)}>
								{item.icon}
								{item.label}
							</Link>
						))}
					</nav>
				</div>
			</div>

			<div className='p-4 border-t border-slate-800/50 bg-slate-950/30'>
				<div className='p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50'>
					<p className='text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1'>
						Current Clinic
					</p>
					<p className='text-xs font-black text-slate-200 truncate'>
						ID #{user?.clinicId || "---"}
					</p>
				</div>
			</div>
		</aside>
	);
}
