"use client";

import { useEffect, useState, useMemo } from "react";
import {
	fetchTodayAnalytics,
	fetchHourlyAnalytics,
	fetchHistoryAnalytics,
} from "@/lib/services/analyticsService";
import KpiCard from "@/components/analytics/KpiCard";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Cell,
} from "recharts";

export default function AnalyticsPage() {
	const [today, setToday] = useState<any>(null);
	const [hourly, setHourly] = useState<any[]>([]);
	const [history, setHistory] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadAnalytics = async () => {
			setLoading(true);
			const [todayRes, hourlyRes, historyRes] = await Promise.all([
				fetchTodayAnalytics(),
				fetchHourlyAnalytics(new Date().toISOString().split("T")[0]),
				fetchHistoryAnalytics(7),
			]);

			if (todayRes.success) setToday(todayRes.data);
			if (hourlyRes.success) setHourly(hourlyRes.data);
			if (historyRes.success) setHistory(historyRes.data);
			setLoading(false);
		};

		loadAnalytics();
	}, []);

	const chartColors = {
		primary: "#3b82f6",
		emerald: "#10b981",
		amber: "#f59e0b",
		rose: "#f43f5e",
	};

	if (loading) {
		return (
			<div className='p-8 space-y-8 animate-pulse'>
				<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className='h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem]'></div>
					))}
				</div>
				<div className='h-80 bg-slate-100 dark:bg-slate-800 rounded-[2rem]'></div>
				<div className='h-80 bg-slate-100 dark:bg-slate-800 rounded-[2rem]'></div>
			</div>
		);
	}

	return (
		<div className='space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500'>
			<header>
				<h1 className='text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight'>
					Operational Insight
				</h1>
				<p className='text-slate-500 dark:text-slate-400 font-medium'>
					Live metrics and historical trends for your clinic.
				</p>
			</header>

			{/* KPI Cards */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-6'>
				<KpiCard
					title='Tokens Issued'
					value={today?.totalGenerated || 0}
					icon={
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2.5'
								d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
							/>
						</svg>
					}
				/>
				<KpiCard
					title='Patients Served'
					value={today?.totalServed || 0}
					icon={
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2.5'
								d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					}
				/>
				<KpiCard
					title='Tokens Skipped'
					value={today?.totalSkipped || 0}
					icon={
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2.5'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					}
				/>
				<KpiCard
					title='Avg Wait Time'
					value={`${today?.avgWaitMinutes?.toFixed(1) || 0}m`}
					icon={
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2.5'
								d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					}
				/>
			</div>

			<div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
				{/* Hourly Distribution */}
				<div className='bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800'>
					<header className='flex items-center justify-between mb-8'>
						<div>
							<h3 className='text-lg font-black text-slate-900 dark:text-white'>
								Hourly Load
							</h3>
							<p className='text-xs font-bold text-slate-400'>
								Patient arrival distribution today
							</p>
						</div>
						<span className='px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full dark:bg-blue-900/30 dark:text-blue-400'>
							Real-time
						</span>
					</header>

					<div className='w-full h-72'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={hourly}>
								<CartesianGrid
									strokeDasharray='3 3'
									vertical={false}
									stroke='#e2e8f0'
									opacity={0.5}
								/>
								<XAxis
									dataKey='hour'
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
									dy={10}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
								/>
								<Tooltip
									cursor={{ fill: "#f1f5f9" }}
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
										fontSize: "12px",
										fontWeight: "bold",
									}}
								/>
								<Bar
									dataKey='count'
									fill={chartColors.primary}
									radius={[6, 6, 0, 0]}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* 7 Day Trend */}
				<div className='bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800'>
					<header className='flex items-center justify-between mb-8'>
						<div>
							<h3 className='text-lg font-black text-slate-900 dark:text-white'>
								Weekly Trend
							</h3>
							<p className='text-xs font-bold text-slate-400'>
								Queue performance last 7 days
							</p>
						</div>
					</header>

					<div className='w-full h-72'>
						<ResponsiveContainer width='100%' height='100%'>
							<LineChart data={history}>
								<CartesianGrid
									strokeDasharray='3 3'
									vertical={false}
									stroke='#e2e8f0'
									opacity={0.5}
								/>
								<XAxis
									dataKey='date'
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
									dy={10}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
								/>
								<Tooltip
									contentStyle={{
										borderRadius: "16px",
										border: "none",
										boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
										fontSize: "12px",
										fontWeight: "bold",
									}}
								/>
								<Line
									type='monotone'
									dataKey='generated'
									stroke={chartColors.primary}
									strokeWidth={4}
									dot={{
										r: 4,
										fill: chartColors.primary,
										strokeWidth: 2,
										stroke: "#fff",
									}}
									activeDot={{ r: 6, strokeWidth: 0 }}
								/>
								<Line
									type='monotone'
									dataKey='served'
									stroke={chartColors.emerald}
									strokeWidth={4}
									dot={{
										r: 4,
										fill: chartColors.emerald,
										strokeWidth: 2,
										stroke: "#fff",
									}}
									activeDot={{ r: 6, strokeWidth: 0 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	);
}
