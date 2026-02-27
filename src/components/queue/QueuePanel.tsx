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
import ConfirmModal from "@/components/ui/ConfirmModal";
import { showSuccess, showError } from "@/lib/toast";
import WaitingTokensTable from "./WaitingTokensTable";
import GenerateTokenModal from "./GenerateTokenModal";
import { useActionStore } from "@/store/actionStore";

export default function QueuePanel() {
	const [queue, setQueue] = useState<QueueResponse | null>(null);
	const [loading, setLoading] = useState(false);

	const { activeAction, startAction, endAction } = useActionStore();

	// Action Modal States
	const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
	const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
	const [isResetModalOpen, setIsResetModalOpen] = useState(false);
	const [isNewDayModalOpen, setIsNewDayModalOpen] = useState(false);
	const [isActionLoading, setIsActionLoading] = useState(false);

	const loadQueue = async () => {
		setLoading(true);
		const response = await fetchCurrentQueue();
		if (response.success && response.data) {
			setQueue(response.data);
		} else if (!response.success) {
			showError("Failed to refresh queue state.");
		}
		setLoading(false);
	};

	useEffect(() => {
		loadQueue();
	}, []);

	const handleAction = async (name: string, action: () => Promise<any>) => {
		if (activeAction) return;
		startAction(name);
		setLoading(true);

		const response = await action();

		if (response.success) {
			showSuccess(response.message);
			await loadQueue();
		} else {
			showError(response.message);
			// Force reload on failure to ensure UI isn't stale
			await loadQueue();
		}

		setLoading(false);
		endAction();
	};

	const handleGenerateConfirm = async (data: { patientName: string; patientPhone: string }) => {
		if (activeAction) return;
		startAction("generate");
		setIsActionLoading(true);

		const response = await generateToken(data);

		if (response.success) {
			showSuccess(response.message);
			await loadQueue();
			setIsGenerateModalOpen(false);
		} else {
			showError(response.message);
			await loadQueue();
		}

		setIsActionLoading(false);
		endAction();
	};

	const handleSkipConfirm = async () => {
		if (activeAction) return;
		startAction("skip");
		setIsActionLoading(true);

		const response = await skipToken();

		if (response.success) {
			showSuccess(response.message);
			await loadQueue();
			setIsSkipModalOpen(false);
		} else {
			showError(response.message);
			await loadQueue();
		}

		setIsActionLoading(false);
		endAction();
	};

	const handleResetConfirm = async () => {
		if (activeAction) return;
		startAction("reset");
		setIsActionLoading(true);

		const response = await resetTokens();

		if (response.success) {
			showSuccess(response.message);
			await loadQueue();
		} else {
			showError(response.message);
			await loadQueue();
		}

		setIsActionLoading(false);
		setIsResetModalOpen(false);
		endAction();
	};

	const handleNewDayConfirm = async () => {
		if (activeAction) return;
		startAction("new-day");
		setIsActionLoading(true);

		const response = await startNewDay();

		if (response.success) {
			showSuccess(response.message);
			await loadQueue();
		} else {
			showError(response.message);
			await loadQueue();
		}

		setIsActionLoading(false);
		setIsNewDayModalOpen(false);
		endAction();
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
						onClick={() => setIsGenerateModalOpen(true)}
						disabled={loading || !!activeAction}
						className='px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20'>
						Generate Token
					</button>
				</RoleGuard>

				{/* STAFF - Flow Controls */}
				<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR]}>
					<button
						onClick={() => handleAction("serve-next", serveNext)}
						disabled={loading || !!activeAction || queue.waitingCount === 0}
						className='px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20'>
						Serve Next
					</button>

					<button
						onClick={() => setIsSkipModalOpen(true)}
						disabled={loading || !!activeAction || !queue.currentServing}
						className='px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20'>
						Skip
					</button>
				</RoleGuard>

				{/* RECEPTIONIST / ADMIN - Reset Utilities */}
				<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
					<button
						onClick={() => setIsResetModalOpen(true)}
						disabled={loading || !!activeAction}
						className='px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20'>
						Reset Tokens
					</button>
				</RoleGuard>

				{/* ADMIN ONLY - Critical Infrastructure */}
				<RoleGuard allowed={[UserRole.ADMIN]}>
					<button
						onClick={() => setIsNewDayModalOpen(true)}
						disabled={loading || !!activeAction}
						className='px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20'>
						Start New Day
					</button>
				</RoleGuard>
			</div>

			<WaitingTokensTable tokens={queue.waitingTokens} />

			{/* Operational Modals */}
			<GenerateTokenModal
				open={isGenerateModalOpen}
				loading={isActionLoading}
				onClose={() => setIsGenerateModalOpen(false)}
				onSubmit={handleGenerateConfirm}
			/>

			{/* Destructive Action Modals */}
			<ConfirmModal
				open={isSkipModalOpen}
				title='Skip Current Token?'
				description='This will move the current patient to delayed status and call the next patient in the queue. Only use this if the patient is not present.'
				confirmText='Skip Patient'
				onConfirm={handleSkipConfirm}
				onCancel={() => setIsSkipModalOpen(false)}
				loading={isActionLoading}
				variant='warning'
			/>

			<ConfirmModal
				open={isResetModalOpen}
				title='Reset Tokens?'
				description='This will start a new token cycle for the current day. Previous tokens will not be affected but numbering will restart.'
				confirmText='Reset Cycle'
				onConfirm={handleResetConfirm}
				onCancel={() => setIsResetModalOpen(false)}
				loading={isActionLoading}
				variant='danger'
			/>

			<ConfirmModal
				open={isNewDayModalOpen}
				title='Start New Clinic Day?'
				description='This is a critical action. It will close all current records and start a fresh day. All token numbering will restart from #1.'
				confirmText='Start New Day'
				onConfirm={handleNewDayConfirm}
				onCancel={() => setIsNewDayModalOpen(false)}
				loading={isActionLoading}
				variant='primary'
			/>
		</div>
	);
}
