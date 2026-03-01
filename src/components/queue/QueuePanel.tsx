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
			<div className='p-8 text-center text-slate-500 animate-pulse bg-slate-900 border border-slate-800 rounded-xl'>
				Synchronizing queue state...
			</div>
		);
	if (!queue) return null;

	return (
		<div className='space-y-8'>
			{/* Main Queue Control Container */}
			<div className='bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6'>
				<div className='flex justify-between items-center'>
					<h2 className='text-lg font-semibold text-white'>Queue Control</h2>
					<div className='flex items-center gap-2 text-emerald-400 text-sm'>
						<span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
						Live
					</div>
				</div>

				<div className='grid md:grid-cols-2 gap-6'>
					{/* Current Serving Card */}
					<div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center'>
						<p className='text-sm text-slate-400 font-medium uppercase tracking-widest mb-2'>
							Current Serving
						</p>
						<p className='text-6xl font-semibold tracking-tight text-blue-400 tabular-nums'>
							#{queue.currentServing?.tokenNumber ?? "-"}
						</p>
					</div>

					{/* Waiting Status Card */}
					<div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center'>
						<p className='text-sm text-slate-400 font-medium uppercase tracking-widest mb-2'>
							In Waitlist
						</p>
						<p className='text-5xl font-medium text-slate-300 tabular-nums'>
							{queue.waitingCount}
						</p>
					</div>
				</div>

				{/* Primary Staff Actions */}
				<div className='flex flex-wrap gap-3'>
					<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
						<button
							onClick={() => setIsGenerateModalOpen(true)}
							disabled={loading || !!activeAction}
							className='h-10 px-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50'>
							Generate Token
						</button>
					</RoleGuard>

					<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR]}>
						<button
							onClick={() => handleAction("serve-next", serveNext)}
							disabled={
								loading ||
								!!activeAction ||
								(queue.waitingCount === 0 && !queue.currentServing)
							}
							className='h-10 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50'>
							{queue.waitingCount === 0 && queue.currentServing
								? "Serve"
								: "Serve Next"}
						</button>

						<button
							onClick={() => setIsSkipModalOpen(true)}
							disabled={loading || !!activeAction || !queue.currentServing}
							className='h-10 px-6 border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50'>
							Skip
						</button>
					</RoleGuard>

					<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
						<button
							onClick={() => setIsResetModalOpen(true)}
							disabled={loading || !!activeAction}
							className='h-10 px-4 text-red-400 hover:bg-red-500/10 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50'>
							Reset Tokens
						</button>
					</RoleGuard>

					<RoleGuard allowed={[UserRole.ADMIN]}>
						<button
							onClick={() => setIsNewDayModalOpen(true)}
							disabled={loading || !!activeAction}
							className='h-10 px-4 border border-purple-600/50 text-purple-400 hover:bg-purple-600/10 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50'>
							Start New Day
						</button>
					</RoleGuard>
				</div>
			</div>

			{/* Upcoming Tokens Table Container */}
			<div className='bg-slate-900 border border-slate-800 rounded-xl p-6'>
				<WaitingTokensTable tokens={queue.waitingTokens} />
			</div>

			{/* Operational Modals */}
			<GenerateTokenModal
				open={isGenerateModalOpen}
				loading={isActionLoading}
				onClose={() => setIsGenerateModalOpen(false)}
				onSubmit={handleGenerateConfirm}
			/>

			{/* Modals */}
			<ConfirmModal
				open={isSkipModalOpen}
				title='Skip Current Token?'
				description='This will move the current patient to delayed status and call the next patient.'
				confirmText='Skip'
				onConfirm={handleSkipConfirm}
				onCancel={() => setIsSkipModalOpen(false)}
				loading={isActionLoading}
				variant='warning'
			/>

			<ConfirmModal
				open={isResetModalOpen}
				title='Reset Tokens?'
				description='This will restart numbering for today. Previous records remain.'
				confirmText='Reset Cycle'
				onConfirm={handleResetConfirm}
				onCancel={() => setIsResetModalOpen(false)}
				loading={isActionLoading}
				variant='danger'
			/>

			<ConfirmModal
				open={isNewDayModalOpen}
				title='Start New Clinic Day?'
				description='This closes all current records and restarts numbering from #1.'
				confirmText='Start New Day'
				onConfirm={handleNewDayConfirm}
				onCancel={() => setIsNewDayModalOpen(false)}
				loading={isActionLoading}
				variant='primary'
			/>
		</div>
	);
}
