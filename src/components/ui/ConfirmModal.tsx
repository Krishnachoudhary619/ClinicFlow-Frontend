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
		primary: "bg-blue-600 hover:bg-blue-500",
		danger: "bg-rose-600 hover:bg-rose-500",
		warning: "bg-amber-500 hover:bg-amber-400",
	};

	return (
		<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='w-full max-w-md bg-slate-900 rounded-xl p-6 border border-slate-800 animate-in zoom-in-95 duration-200'>
				<div className='mb-6'>
					<h2 className='text-lg font-semibold text-white mb-2'>{title}</h2>
					<p className='text-slate-400 text-sm leading-relaxed'>{description}</p>
				</div>

				<div className='flex gap-3 justify-end'>
					<button
						onClick={onCancel}
						disabled={loading}
						className='h-10 px-4 text-sm font-semibold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50'>
						{cancelText}
					</button>

					<button
						onClick={onConfirm}
						disabled={loading}
						className={`h-10 px-4 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50 ${variantClasses[variant]}`}>
						{loading ? "Processing..." : confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
