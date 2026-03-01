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
		<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='w-full max-w-md bg-slate-900 rounded-xl p-6 border border-slate-800 animate-in zoom-in-95 duration-200'>
				<div className='mb-6'>
					<h2 className='text-lg font-semibold text-white mb-1'>New Patient Token</h2>
					<p className='text-slate-400 text-sm'>
						Enter details to generate a queue token.
					</p>
				</div>

				<form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
					<div>
						<label className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
							Patient Name
						</label>
						<input
							{...register("patientName", { required: "Name is required" })}
							placeholder='Full Name'
							autoFocus
							className={`w-full h-10 px-4 bg-slate-800 border ${
								errors.patientName ? "border-rose-500" : "border-slate-700"
							} rounded-lg text-white text-sm focus:border-blue-500 outline-none transition-all`}
						/>
						{errors.patientName && (
							<p className='mt-1 text-[11px] font-bold text-rose-500'>
								{errors.patientName.message}
							</p>
						)}
					</div>

					<div>
						<label className='block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'>
							Phone Number (Optional)
						</label>
						<input
							{...register("patientPhone")}
							placeholder='+91 00000 00000'
							className='w-full h-10 px-4 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 outline-none transition-all'
						/>
					</div>

					<div className='flex gap-3 pt-4'>
						<button
							type='button'
							onClick={onClose}
							disabled={loading}
							className='flex-1 h-10 text-sm font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50'>
							Cancel
						</button>

						<button
							type='submit'
							disabled={loading}
							className='flex-[1.5] h-10 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50'>
							{loading ? "Generating..." : "Generate Token"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
