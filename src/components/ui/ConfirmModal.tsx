"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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

	if (!mounted || !open) return null;

	const variantClasses = {
		primary: "bg-blue-600 hover:bg-blue-700",
		danger: "bg-rose-600 hover:bg-rose-700",
		warning: "bg-amber-500 hover:bg-amber-600",
	};

	return createPortal(
		<div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200'>
			<div className='w-full max-w-md bg-white dark:bg-slate-900 rounded-[1.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200'>
				<div className='mb-6'>
					<h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight'>
						{title}
					</h3>
					<p className='text-slate-500 dark:text-slate-400 text-sm leading-relaxed'>
						{description}
					</p>
				</div>

				<div className='flex gap-3 justify-end mt-8'>
					<button
						onClick={onCancel}
						disabled={loading}
						className='px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50'>
						{cancelText}
					</button>

					<button
						onClick={onConfirm}
						disabled={loading}
						className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${variantClasses[variant]}`}>
						{loading ? "Processing..." : confirmText}
					</button>
				</div>
			</div>
		</div>,
		document.body,
	);
}
