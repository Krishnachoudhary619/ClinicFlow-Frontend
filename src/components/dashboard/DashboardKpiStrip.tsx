"use client";

interface KpiCardProps {
	title: string;
	value: string | number;
}

function KpiCard({ title, value }: KpiCardProps) {
	return (
		<div className='bg-slate-900 border border-slate-800 rounded-xl p-4 transition-all duration-200 hover:border-slate-700'>
			<p className='text-sm text-slate-400 font-medium'>{title}</p>
			<p className='text-2xl font-semibold text-white mt-1 tabular-nums'>{value}</p>
		</div>
	);
}

interface DashboardKpiStripProps {
	waitingCount: number;
	todayGenerated: number;
	todayServed: number;
	avgWait: string | number;
}

export default function DashboardKpiStrip({
	waitingCount,
	todayGenerated,
	todayServed,
	avgWait,
}: DashboardKpiStripProps) {
	return (
		<div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
			<KpiCard title='Active Queue' value={waitingCount} />
			<KpiCard title='Generated Today' value={todayGenerated} />
			<KpiCard title='Served Today' value={todayServed} />
			<KpiCard title='Avg Wait (mins)' value={avgWait} />
		</div>
	);
}
