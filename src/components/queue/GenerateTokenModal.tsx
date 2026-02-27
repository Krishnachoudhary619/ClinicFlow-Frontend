"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface Props {
	open: boolean;
	loading?: boolean;
	onClose: () => void;
	onSubmit: (data: { patientName: string; patientPhone: string }) => void;
}

export default function GenerateTokenModal({ open, loading = false, onClose, onSubmit }: Props) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<{
		patientName: string;
		patientPhone: string;
	}>();

	// Prevent scrolling when modal is open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [open]);

	if (!open) return null;

	const handleFormSubmit = (data: { patientName: string; patientPhone: string }) => {
		onSubmit(data);
		reset();
	};

	return (
		<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-800'>
				<div className='mb-8'>
					<h2 className='text-3xl font-black text-slate-900 dark:text-white mb-2'>
						New Patient Token
					</h2>
					<p className='text-slate-500 dark:text-slate-400 font-medium'>
						Enter patient details to generate a live queue token.
					</p>
				</div>

				<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
					<div>
						<label className='block text-xs font-black uppercase tracking-widest text-slate-500 mb-2'>
							Patient Name
						</label>
						<input
							{...register("patientName", { required: "Patient name is required" })}
							placeholder='e.g. John Doe'
							autoFocus
							className={`w-full px-4 py-3.5 bg-slate-50 border ${
								errors.patientName
									? "border-rose-300 ring-rose-50"
									: "border-slate-200"
							} rounded-2xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
						/>
						{errors.patientName && (
							<p className='mt-2 text-xs font-bold text-rose-500 uppercase tracking-wider'>
								{errors.patientName.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-xs font-black uppercase tracking-widest text-slate-500 mb-2'>
							Phone Number (Optional)
						</label>
						<input
							{...register("patientPhone")}
							placeholder='e.g. +91 9876543210'
							className='w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white'
						/>
					</div>

					<div className='flex flex-col sm:flex-row gap-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							disabled={loading}
							className='flex-1 px-6 py-4 text-sm font-bold text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50'>
							Cancel
						</button>

						<button
							type='submit'
							disabled={loading}
							className='flex-[2] px-6 py-4 text-sm font-black text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50'>
							{loading ? (
								<div className='flex items-center justify-center gap-2'>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									<span>Generating...</span>
								</div>
							) : (
								"Print Token"
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
