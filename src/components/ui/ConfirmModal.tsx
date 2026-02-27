"use client";

import { ReactNode, useEffect } from "react";

interface ConfirmModalProps {
	open: boolean;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	loading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	variant?: "primary" | "danger" | "warning";
}

export default function ConfirmModal({
	open,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	loading = false,
	onConfirm,
	onCancel,
	variant = "danger",
}: ConfirmModalProps) {
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

	const variantClasses = {
		primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
		danger: "bg-rose-600 hover:bg-rose-700 shadow-rose-500/20",
		warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
	};

	return (
		<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 dark:bg-slate-900 dark:border-slate-800'>
				<div className='mb-6'>
					<h2 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>
						{title}
					</h2>
					<p className='text-slate-500 dark:text-slate-400 font-medium leading-relaxed'>
						{description}
					</p>
				</div>

				<div className='flex flex-col sm:flex-row gap-3 sm:justify-end'>
					<button
						onClick={onCancel}
						disabled={loading}
						className='px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50'>
						{cancelText}
					</button>

					<button
						onClick={onConfirm}
						disabled={loading}
						className={`px-6 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${variantClasses[variant]}`}>
						{loading ? (
							<div className='flex items-center gap-2'>
								<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
								<span>Processing...</span>
							</div>
						) : (
							confirmText
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
