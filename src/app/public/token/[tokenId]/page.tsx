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
					Fetching live status...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen p-6 bg-slate-50 dark:bg-slate-950'>
				<div className='bg-white p-8 rounded-3xl shadow-xl border border-red-100 max-w-md w-full text-center dark:bg-slate-900 dark:border-red-900/20'>
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
						Token Not Found
					</h1>
					<p className='text-slate-600 dark:text-slate-400 mb-8'>{error}</p>
					<button
						onClick={() => window.location.reload()}
						className='w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-900'>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className='flex items-center justify-center min-h-screen bg-slate-50 p-6 dark:bg-slate-950'>
			<div className='bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-slate-100 dark:bg-slate-900 dark:border-slate-800'>
				<div className='mb-8'>
					<span className='px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-[0.2em] rounded-full dark:bg-blue-900/30 dark:text-blue-400'>
						ClinicFlow Live
					</span>
					<h1 className='text-3xl font-black text-slate-900 dark:text-white mt-4'>
						Your Number
					</h1>
				</div>

				<div className='relative mb-10'>
					<div className='text-8xl font-black text-blue-600 tabular-nums'>
						#{data?.tokenNumber}
					</div>
					<div className='absolute -top-1 -right-1'>
						<div className='relative flex h-3 w-3'>
							<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
							<span className='relative inline-flex rounded-full h-3 w-3 bg-blue-500'></span>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4 mb-10'>
					<div className='p-4 bg-slate-50 rounded-2xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50'>
						<p className='text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1'>
							Currently Number
						</p>
						<p className='text-2xl font-black text-slate-900 dark:text-white'>
							#{data?.currentServing ?? "--"}
						</p>
					</div>
					<div className='p-4 bg-blue-50 rounded-2xl border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20'>
						<p className='text-[10px] uppercase tracking-wider font-bold text-blue-400 mb-1'>
							Ahead of You
						</p>
						<p className='text-2xl font-black text-blue-900 dark:text-blue-200'>
							{data?.patientsAhead}
						</p>
					</div>
				</div>

				<div className='space-y-6 mb-8'>
					<div className='flex items-center justify-between p-4 bg-emerald-50 text-emerald-700 rounded-2xl dark:bg-emerald-900/10 dark:text-emerald-400'>
						<div className='flex items-center gap-2'>
							<svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
									clipRule='evenodd'
								/>
							</svg>
							<span className='font-bold'>Estimated Wait Time</span>
						</div>
						<span className='text-xl font-black'>{data?.estimatedWaitMinutes}m</span>
					</div>

					<div className='flex items-center justify-center gap-2'>
						<div
							className={`w-2.5 h-2.5 rounded-full ${data?.status === "CALLED" ? "bg-amber-500 animate-bounce" : "bg-blue-500"}`}></div>
						<p className='text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest'>
							{data?.status === "CALLED" ? "PLEASE HEAD TO COUNTER" : data?.status}
						</p>
					</div>
				</div>

				<p className='text-[10px] text-slate-400 dark:text-slate-500 font-medium italic'>
					This status updates automatically every 30 seconds.
				</p>
			</div>
		</div>
	);
}
