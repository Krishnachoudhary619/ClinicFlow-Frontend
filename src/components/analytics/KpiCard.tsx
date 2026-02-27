"use client";

interface Props {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	trend?: {
		value: number;
		isUp: boolean;
	};
}

export default function KpiCard({ title, value, icon, trend }: Props) {
	return (
		<div className='bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none'>
			<div className='flex items-center justify-between mb-4'>
				<p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>
					{title}
				</p>
				{icon && (
					<div className='p-2 bg-slate-50 rounded-xl dark:bg-slate-800 text-blue-600 dark:text-blue-400'>
						{icon}
					</div>
				)}
			</div>

			<div className='flex items-baseline gap-2'>
				<p className='text-3xl font-black text-slate-900 dark:text-white tabular-nums'>
					{value}
				</p>
				{trend && (
					<span
						className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
							trend.isUp
								? "bg-emerald-50 text-emerald-600"
								: "bg-rose-50 text-rose-600"
						}`}>
						{trend.isUp ? "+" : "-"}
						{trend.value}%
					</span>
				)}
			</div>
		</div>
	);
}
