"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { trackPublicToken } from "@/lib/services/publicService";
import { PublicTokenResponse } from "@/types/queue";
import { showError } from "@/lib/toast";

export default function TrackTokenPage() {
	const { code } = useParams();
	const router = useRouter();
	const [data, setData] = useState<PublicTokenResponse | null>(null);
	const [loading, setLoading] = useState(true);

	const loadStatus = useCallback(
		async (isAuto = false) => {
			if (!isAuto) setLoading(true);
			const res = await trackPublicToken(code as string);
			if (res.success && res.data) {
				setData(res.data);
			} else if (!isAuto) {
				showError(res.message || "Token not found");
			}
			setLoading(false);
		},
		[code],
	);

	useEffect(() => {
		loadStatus();

		const interval = setInterval(() => {
			if (
				data?.status !== "SERVED" &&
				data?.status !== "EXPIRED" &&
				data?.isActive !== false
			) {
				loadStatus(true);
			}
		}, 10000);

		return () => clearInterval(interval);
	}, [code, data?.status, data?.isActive, loadStatus]);

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-950 flex items-center justify-center'>
				<div className='animate-pulse text-slate-500 font-medium'>Fetching status...</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center'>
				<h1 className='text-2xl font-bold text-white mb-2'>Token Expired or Invalid</h1>
				<p className='text-slate-400'>We couldn't find an active token with this code.</p>
			</div>
		);
	}

	const isCalled = data.status === "CALLED";
	const isServed = data.status === "SERVED";
	const isDelayed = data.status === "DELAYED";
	const isFinished = isServed || data.status === "EXPIRED" || !data.isActive;

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200'>
			<div className='max-w-md mx-auto pt-16 pb-24 px-6'>
				<div className='text-center mb-10'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full dark:bg-slate-800 dark:text-slate-400 mb-6'>
						<div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></div>
						{data.clinicName}
					</div>
					<h1 className='text-3xl font-black text-slate-900 dark:text-white tracking-tighter'>
						Your Token Status
					</h1>
				</div>

				{/* Main Token Card */}
				<div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-2xl mb-8 transition-all duration-500'>
					<div className='relative z-10'>
						<p className='text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4'>
							Token Number
						</p>
						<p
							className={`text-8xl font-black tabular-nums mb-6 tracking-tighter transition-colors duration-500 ${
								isCalled
									? "text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
									: isServed
										? "text-emerald-500"
										: isDelayed
											? "text-rose-500"
											: "text-blue-600 dark:text-blue-400"
							}`}>
							<span className='text-3xl opacity-40 mr-1'>#</span>
							{data.tokenNumber}
						</p>

						<div className='inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl mb-8'>
							<span
								className={`w-2 h-2 rounded-full ${isFinished ? "bg-slate-400" : "bg-emerald-500 animate-pulse"}`}
							/>
							<span className='text-[10px] font-black uppercase tracking-widest'>
								{data.status}
							</span>
						</div>

						{/* Progress Messaging */}
						<div className='mb-2'>
							{isCalled ? (
								<div className='animate-bounce bg-amber-50 text-amber-700 py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider dark:bg-amber-900/20 dark:text-amber-400'>
									It is your turn! Head to Counter.
								</div>
							) : isServed ? (
								<div className='bg-emerald-50 text-emerald-700 py-3 px-6 rounded-2xl font-bold text-sm dark:bg-emerald-900/20 dark:text-emerald-400'>
									Visit completed. Stay healthy!
								</div>
							) : isDelayed ? (
								<div className='bg-rose-50 text-rose-700 py-3 px-6 rounded-2xl font-bold text-sm dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'>
									Token skipped. See reception.
								</div>
							) : (
								<div className='text-slate-500 dark:text-slate-400 font-bold text-sm'>
									{data.waitingBeforeYou === 0 ? (
										<p className='text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2'>
											<span className='w-2 h-2 bg-blue-600 rounded-full animate-ping'></span>
											You are next in line!
										</p>
									) : (
										<p>
											<span className='text-slate-900 dark:text-white'>
												{data.waitingBeforeYou} patients
											</span>{" "}
											currently ahead.
										</p>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Decorative Background Blob */}
					<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-transparent to-transparent opacity-50' />
				</div>

				{/* Metrics Grid */}
				{!isFinished && !isDelayed && (
					<div className='grid grid-cols-2 gap-4 mb-8'>
						<div className='bg-blue-600 rounded-3xl p-6 text-center text-white shadow-xl shadow-blue-500/20'>
							<p className='text-[10px] font-black uppercase tracking-widest opacity-70 mb-1'>
								Ahead of You
							</p>
							<p className='text-3xl font-black'>{data.waitingBeforeYou}</p>
						</div>
						<div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-center shadow-lg'>
							<p className='text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1'>
								Wait Time
							</p>
							<p className='text-2xl font-black text-slate-900 dark:text-white'>
								{data.estimatedWaitMinutes}
								<span className='text-xs ml-1'>mins</span>
							</p>
						</div>
					</div>
				)}

				{/* Secondary Info */}
				<div className='space-y-4'>
					<div className='bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-5 flex items-center justify-between'>
						<span className='text-xs font-black text-slate-400 uppercase tracking-widest'>
							Currently Serving
						</span>
						<span className='text-lg font-black text-blue-500'>
							#{data.currentServing || "-"}
						</span>
					</div>

					<div className='p-4 text-center'>
						<p className='text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest'>
							Token Code: {data.publicTokenCode}
						</p>
						{isFinished && (
							<button
								onClick={() => router.push("/")}
								className='mt-6 text-sm text-blue-600 font-black hover:text-blue-500 underline underline-offset-4 uppercase tracking-[0.1em]'>
								Get a new token
							</button>
						)}
					</div>
				</div>

				{/* Mobile Sticky Action Bar - Premium Footer */}
				{!isFinished && (
					<div className='fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none'>
						<div className='max-w-md mx-auto pointer-events-auto'>
							<div
								className={`flex items-center justify-between p-4 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
									isCalled
										? "bg-amber-500 border-amber-400"
										: "bg-slate-900/95 border-slate-800 dark:bg-slate-950/95"
								}`}>
								<div className='flex items-center gap-3 ml-2'>
									<div
										className={`w-3 h-3 rounded-full ${isCalled ? "bg-white animate-ping" : "bg-blue-500 animate-pulse"}`}></div>
									<div className='text-left'>
										<p className='text-[9px] font-black text-white/50 uppercase tracking-widest leading-tight'>
											Live Updates
										</p>
										<p className='text-xs font-black text-white uppercase tracking-wider leading-tight'>
											{isCalled ? "Head to Counter Now" : "Waiting in Queue"}
										</p>
									</div>
								</div>
								<div className='mr-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10'>
									<p className='text-[9px] font-black text-white/40 uppercase tracking-widest text-center leading-none mb-0.5'>
										Est
									</p>
									<p className='text-sm font-black text-white leading-none'>
										{data.estimatedWaitMinutes}m
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
