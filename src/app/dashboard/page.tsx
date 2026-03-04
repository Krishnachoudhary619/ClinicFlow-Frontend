"use client";

import { useEffect, useState } from "react";
import QueuePanel from "@/components/queue/QueuePanel";
import DashboardKpiStrip from "@/components/dashboard/DashboardKpiStrip";
import { fetchTodayAnalytics } from "@/lib/services/analyticsService";
import { fetchCurrentQueue } from "@/lib/services/queueService";

export default function DashboardPage() {
	const [analytics, setAnalytics] = useState<any>(null);
	const [queueData, setQueueData] = useState<any>(null);

	const loadData = async () => {
		const [analyticsRes, queueRes] = await Promise.all([
			fetchTodayAnalytics(),
			fetchCurrentQueue(),
		]);

		if (analyticsRes.success) setAnalytics(analyticsRes.data);
		if (queueRes.success) setQueueData(queueRes.data);
	};

	useEffect(() => {
		loadData();

		// Refresh every 30s to keep KPI strip live
		const interval = setInterval(loadData, 30000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className='max-w-7xl mx-auto space-y-8'>
			{/* Page Header */}
			<div>
				<h1 className='text-3xl font-semibold tracking-tight text-white'>Dashboard</h1>
				<p className='text-slate-400 mt-1'>Manage your clinic operations efficiently.</p>
			</div>

			{/* KPI Strip */}
			<DashboardKpiStrip
				waitingCount={queueData?.waitingCount || 0}
				todayGenerated={analytics?.totalGenerated || 0}
				todayServed={analytics?.totalServed || 0}
				avgWait={analytics?.avgWaitMinutes?.toFixed(1) || 0}
			/>

			{/* Main Queue Control */}
			<QueuePanel onActionComplete={loadData} />
		</div>
	);
}
