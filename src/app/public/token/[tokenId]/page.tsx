"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

interface PublicTokenResponse {
	tokenNumber: number;
	status: string;
	currentServing: number | null;
	patientsAhead: number;
	estimatedWaitMinutes: number;
}

export default function PublicTokenPage() {
	const params = useParams();
	const tokenId = params.tokenId as string;

	const [data, setData] = useState<PublicTokenResponse | null>(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const fetchToken = useCallback(async () => {
		const response = await apiRequest<PublicTokenResponse>(
			"get",
			ENDPOINTS.PUBLIC.TOKEN(tokenId),
		);

		if (response.success && response.data) {
			setData(response.data);
			setError("");
		} else {
			setError(response.message || "Unable to find token information.");
		}
		setLoading(false);
	}, [tokenId]);

	useEffect(() => {
		if (tokenId) {
			fetchToken();
			// Auto-refresh token status every 30 seconds
			const interval = setInterval(fetchToken, 30000);
			return () => clearInterval(interval);
		}
	}, [tokenId, fetchToken]);

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950'>
				<div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4'></div>
				<p className='text-slate-600 dark:text-slate-400 font-medium'>
					Connecting to live queue...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950'>
				<div className='bg-white p-8 rounded-[3rem] shadow-xl border border-red-100 max-w-md w-full text-center dark:bg-slate-900 dark:border-red-900/20'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-red-900/20'>
						<svg
							className='w-8 h-8 text-red-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							/>
						</svg>
					</div>
					<h1 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
						Invalid Token
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mb-8'>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className='w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900'>
						Check Status Again
					</button>
				</div>
			</div>
		);
	}

	const isCalled = data?.status === "CALLED";
	const isServed = data?.status === "SERVED";
	const isDelayed = data?.status === "DELAYED";

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 pb-24 md:pb-4 dark:bg-slate-950 transition-colors duration-500'>
			<div className='bg-white p-6 md:p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md text-center border border-slate-100 dark:bg-slate-900 dark:border-slate-800 transition-all duration-500'>
				{/* Top Identity Panel */}
				<div className='mb-10'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full dark:bg-slate-800 dark:text-slate-400'>
						<div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></div>
						Official Clinic Queue
					</div>
					<h1 className='text-2xl font-bold text-slate-400 dark:text-slate-600 mt-6 capitalize'>
						Patient Token
					</h1>
				</div>

				{/* Main Token Focus */}
				<div className='relative mb-12 flex justify-center'>
					<div
						className={`relative transition-all duration-700 ${isCalled ? "scale-110" : "scale-100"}`}>
						{isCalled && (
							<div className='absolute inset-0 bg-amber-400 blur-3xl opacity-30 animate-pulse'></div>
						)}
						<div
							className={`text-9xl md:text-[10rem] font-black leading-none tabular-nums tracking-tighter transition-colors duration-500 ${
								isCalled
									? "text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
									: isServed
										? "text-emerald-500"
										: isDelayed
											? "text-rose-500 underline decoration-4"
											: "text-blue-600"
							}`}>
							<span className='text-4xl align-top mr-1 opacity-40'>#</span>
							{data?.tokenNumber}
						</div>
					</div>
				</div>

				{/* Psychological Progress Messaging */}
				<div className='mb-10 px-4'>
					{isCalled ? (
						<div className='animate-bounce bg-amber-50 text-amber-700 py-3 px-6 rounded-2xl font-black text-sm uppercase tracking-wider dark:bg-amber-900/20 dark:text-amber-400'>
							It is your turn! Please head to counter.
						</div>
					) : isServed ? (
						<div className='bg-emerald-50 text-emerald-700 py-3 px-6 rounded-2xl font-bold text-sm dark:bg-emerald-900/20 dark:text-emerald-400'>
							Visit completed. Stay healthy!
						</div>
					) : isDelayed ? (
						<div className='bg-rose-50 text-rose-700 py-3 px-6 rounded-2xl font-bold text-sm dark:bg-rose-900/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30'>
							Token skipped. Please see reception.
						</div>
					) : (
						<div className='text-slate-500 dark:text-slate-400 font-bold'>
							{data?.patientsAhead === 0 ? (
								<p className='text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2'>
									<span className='w-2 h-2 bg-blue-600 rounded-full animate-ping'></span>
									You are next in line! Stay ready.
								</p>
							) : (
								<p>
									<span className='text-slate-900 dark:text-white'>
										{data?.patientsAhead} patients
									</span>{" "}
									currently ahead of you.
								</p>
							)}
						</div>
					)}
				</div>

				{/* Metrics Grid - Hierarchical Redesign */}
				{!isServed && !isDelayed && (
					<div className='grid grid-cols-2 gap-4 mb-8'>
						<div className='p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/20'>
							<p className='text-[10px] uppercase tracking-widest font-black opacity-80 mb-2'>
								Patients Waiting
							</p>
							<p className='text-4xl font-black'>{data?.patientsAhead}</p>
						</div>
						<div className='p-6 bg-slate-50 rounded-[2rem] border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'>
							<p className='text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2'>
								Now Serving
							</p>
							<p className='text-2xl font-black text-slate-900 dark:text-white tabular-nums'>
								#{data?.currentServing ?? "--"}
							</p>
						</div>
					</div>
				)}

				{/* Wait Time Display */}
				{!isServed && !isDelayed && (
					<div
						className={`mb-10 p-5 rounded-3xl border transition-all duration-500 ${
							isCalled
								? "bg-amber-500 border-amber-600 shadow-lg shadow-amber-500/20"
								: "bg-emerald-50 content-between items-center border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20"
						}`}>
						<div className='flex items-center justify-center gap-3'>
							<svg
								className={`w-5 h-5 ${isCalled ? "text-white" : "text-emerald-500"}`}
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
							<span
								className={`text-sm font-black uppercase tracking-wider ${isCalled ? "text-white" : "text-emerald-700 dark:text-emerald-400"}`}>
								{isCalled
									? "Serve Time Now"
									: `Approx. wait: ${data?.estimatedWaitMinutes} mins`}
							</span>
						</div>
					</div>
				)}

				<p className='text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-widest'>
					Secure Live Status Update
				</p>
			</div>

			{/* Mobile Sticky Action Bar */}
			<div className='fixed bottom-0 left-0 right-0 p-4 md:hidden z-50 pointer-events-none'>
				<div className='max-w-md mx-auto pointer-events-auto'>
					<div
						className={`flex items-center justify-between p-4 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
							isCalled
								? "bg-amber-500 border-amber-400"
								: isServed
									? "bg-emerald-600 border-emerald-500"
									: isDelayed
										? "bg-rose-600 border-rose-500"
										: "bg-slate-900/95 border-slate-800"
						}`}>
						<div className='flex items-center gap-3 ml-2'>
							<div
								className={`w-3 h-3 rounded-full ${isCalled ? "bg-white animate-ping" : "bg-blue-500"}`}></div>
							<div className='text-left'>
								<p className='text-[9px] font-black text-white/60 uppercase tracking-widest leading-tight'>
									Live Status
								</p>
								<p className='text-xs font-black text-white uppercase tracking-wider leading-tight'>
									{isCalled
										? "Called: Head to Counter"
										: isServed
											? "Visit Completed"
											: isDelayed
												? "Token Passed"
												: "Waiting in Queue"}
								</p>
							</div>
						</div>
						{!isServed && !isDelayed && (
							<div className='mr-2 px-4 py-1.5 bg-white/20 rounded-full'>
								<p className='text-[9px] font-black text-white/60 uppercase tracking-widest text-center'>
									Wait
								</p>
								<p className='text-sm font-black text-white'>
									{data?.estimatedWaitMinutes}m
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
