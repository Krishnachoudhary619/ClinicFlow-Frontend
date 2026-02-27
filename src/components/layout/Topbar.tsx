"use client";

import UserDropdown from "./UserDropdown";

interface Props {
	onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
	return (
		<header className='h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 dark:bg-slate-950/80 dark:border-slate-800'>
			<div className='flex items-center gap-4'>
				<button
					onClick={onMenuClick}
					className='md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors dark:text-slate-400 dark:hover:bg-slate-800'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M4 6h16M4 12h16M4 18h16'
						/>
					</svg>
				</button>
				<h2 className='font-black text-slate-900 dark:text-white md:text-xl tracking-tight'>
					Dashboard
				</h2>
			</div>

			<UserDropdown />
		</header>
	);
}
