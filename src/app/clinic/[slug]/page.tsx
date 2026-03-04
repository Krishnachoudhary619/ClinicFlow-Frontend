"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicClinic, generatePublicToken } from "@/lib/services/publicService";
import { PublicClinicResponse } from "@/types/queue";
import { showError, showSuccess } from "@/lib/toast";

export default function PublicClinicPage() {
	const { slug } = useParams();
	const router = useRouter();
	const [clinic, setClinic] = useState<PublicClinicResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		patientName: "",
		patientPhone: "",
	});

	useEffect(() => {
		const loadClinic = async () => {
			const res = await getPublicClinic(slug as string);
			if (res.success && res.data) {
				setClinic(res.data);
			} else {
				showError(res.message || "Clinic not found");
			}
			setLoading(false);
		};
		loadClinic();
	}, [slug]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!clinic) return;

		setSubmitting(true);
		const res = await generatePublicToken({
			clinicId: clinic.clinicId,
			...formData,
		});

		if (res.success && res.data) {
			showSuccess("Token generated successfully!");
			localStorage.setItem("activeToken", res.data.publicTokenCode);
			router.push(`/track/${res.data.publicTokenCode}`);
		} else {
			showError(res.message || "Failed to generate token");
		}
		setSubmitting(false);
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-slate-950 flex items-center justify-center'>
				<div className='animate-pulse text-slate-500 font-medium'>
					Loading clinic details...
				</div>
			</div>
		);
	}

	if (!clinic) {
		return (
			<div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center'>
				<h1 className='text-2xl font-bold text-white mb-2'>Clinic Not Found</h1>
				<p className='text-slate-400'>The clinic link you followed seems to be invalid.</p>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 transition-colors duration-500'>
			<div className='max-w-md mx-auto pt-16 pb-12 px-6'>
				{/* Identity Badge */}
				<div className='flex justify-center mb-8'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full dark:bg-slate-800 dark:text-slate-400'>
						<div className='w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse'></div>
						Official Clinic Queue
					</div>
				</div>

				{/* Clinic Header */}
				<div className='text-center mb-10'>
					<h1 className='text-4xl font-black text-slate-900 dark:text-white tracking-tighter'>
						{clinic.name}
					</h1>
					<p className='text-slate-500 dark:text-slate-400 mt-3 text-sm font-bold uppercase tracking-wider'>
						{clinic.address}
					</p>
				</div>

				{/* Queue Summary Grid - Redesigned from deleted UI */}
				<div className='grid grid-cols-2 gap-4 mb-10'>
					<div className='bg-blue-600 rounded-[2rem] p-6 text-center shadow-xl shadow-blue-500/20'>
						<p className='text-[10px] uppercase tracking-widest text-white/70 font-black mb-2'>
							Now Serving
						</p>
						<p className='text-4xl font-black text-white tabular-nums'>
							#{clinic.currentServing || "-"}
						</p>
					</div>
					<div className='bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 text-center shadow-lg'>
						<p className='text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2'>
							Waitlist
						</p>
						<p className='text-4xl font-black text-slate-900 dark:text-white tabular-nums'>
							{clinic.waitingCount}
						</p>
					</div>
				</div>

				{/* Status Notice */}
				{!clinic.isQueueOpen && (
					<div className='bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl p-4 mb-8 text-center animate-pulse'>
						<p className='text-rose-600 dark:text-rose-400 text-sm font-black uppercase tracking-wider'>
							The queue is currently closed
						</p>
					</div>
				)}

				{/* Join Queue Form Card */}
				<div
					className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-500 ${!clinic.isQueueOpen ? "opacity-50 grayscale pointer-events-none" : ""}`}>
					<div className='relative z-10'>
						<h3 className='text-xl font-black text-slate-900 dark:text-white mb-8 tracking-tight'>
							Join Queue
						</h3>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-2'>
								<label className='text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1'>
									Your Full Name
								</label>
								<input
									required
									type='text'
									placeholder='Enter name...'
									className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 font-bold'
									value={formData.patientName}
									onChange={(e) =>
										setFormData({ ...formData, patientName: e.target.value })
									}
								/>
							</div>
							<div className='space-y-2'>
								<label className='text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1'>
									Phone Number (Optional)
								</label>
								<input
									type='tel'
									placeholder='Enter phone...'
									className='w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 font-bold'
									value={formData.patientPhone}
									onChange={(e) =>
										setFormData({ ...formData, patientPhone: e.target.value })
									}
								/>
							</div>
							<button
								disabled={submitting || !clinic.isQueueOpen}
								type='submit'
								className='w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 mt-4 text-sm uppercase tracking-[0.2em]'>
								{submitting ? "Processing..." : "Get Token"}
							</button>
						</form>
					</div>

					{/* Background Decoration */}
					<div className='absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full' />
					<div className='absolute -top-10 -left-10 w-24 h-24 bg-blue-600/5 blur-2xl rounded-full' />
				</div>

				{/* Footnote */}
				<p className='text-center mt-10 text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em]'>
					Secure Live Cloud Queue
				</p>
			</div>
		</div>
	);
}
