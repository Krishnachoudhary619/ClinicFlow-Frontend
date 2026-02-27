"use client";

import { useEffect, useState } from "react";
import {
	fetchCurrentQueue,
	generateToken,
	serveNext,
	skipToken,
	resetTokens,
	startNewDay,
} from "@/lib/services/queueService";
import { QueueResponse } from "@/types/queue";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/types/user";

export default function QueuePanel() {
	const [queue, setQueue] = useState<QueueResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const loadQueue = async () => {
		setLoading(true);
		const response = await fetchCurrentQueue();
		if (response.success && response.data) {
			setQueue(response.data);
		}
		setLoading(false);
	};

	useEffect(() => {
		loadQueue();
	}, []);

	const handleAction = async (action: () => Promise<any>) => {
		setLoading(true);
		await action();
		await loadQueue();
		setLoading(false);
	};

	if (!queue && loading)
		return (
			<div className='p-8 text-center text-slate-500 animate-pulse'>
				Synchronizing queue state...
			</div>
		);
	if (!queue) return null;

	return (
		<div className='bg-white p-8 rounded-3xl shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
				<h2 className='text-2xl font-bold text-slate-900 dark:text-white'>
					Queue Control Panel
				</h2>
				<div className='flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full dark:bg-slate-800'>
					<div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
					<span className='text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider'>
						Live System
					</span>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
				<div className='p-6 bg-blue-50 border border-blue-100 rounded-2xl dark:bg-blue-900/10 dark:border-blue-900/20'>
					<p className='text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 text-center'>
						Current Serving
					</p>
					<p className='text-5xl font-black text-blue-900 dark:text-blue-200 text-center'>
						#{queue.currentServing?.tokenNumber ?? "-"}
					</p>
				</div>
				<div className='p-6 bg-emerald-50 border border-emerald-100 rounded-2xl dark:bg-emerald-900/10 dark:border-emerald-900/20'>
					<p className='text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 text-center'>
						Patients Waiting
					</p>
					<p className='text-5xl font-black text-emerald-900 dark:text-emerald-200 text-center'>
						{queue.waitingCount}
					</p>
				</div>
			</div>

			<div className='flex flex-wrap gap-4'>
				{/* RECEPTIONIST / ADMIN - Generate Tokens */}
				<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
					<button
						onClick={() =>
							handleAction(() =>
								generateToken({ patientName: "Walk-in", patientPhone: "NA" }),
							)
						}
						disabled={loading}
						className='px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20'>
						Generate Token
					</button>
				</RoleGuard>

				{/* STAFF - Flow Controls */}
				<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR]}>
					<button
						onClick={() => handleAction(serveNext)}
						disabled={loading || queue.waitingCount === 0}
						className='px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20'>
						Serve Next
					</button>

					<button
						onClick={() => handleAction(skipToken)}
						disabled={loading || !queue.currentServing}
						className='px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20'>
						Skip
					</button>
				</RoleGuard>

				{/* RECEPTIONIST / ADMIN - Reset Utilities */}
				<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
					<button
						onClick={() => handleAction(resetTokens)}
						disabled={loading}
						className='px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20'>
						Reset Tokens
					</button>
				</RoleGuard>

				{/* ADMIN ONLY - Critical Infrastructure */}
				<RoleGuard allowed={[UserRole.ADMIN]}>
					<button
						onClick={() => handleAction(startNewDay)}
						disabled={loading}
						className='px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20'>
						Start New Day
					</button>
				</RoleGuard>
			</div>
		</div>
	);
}
