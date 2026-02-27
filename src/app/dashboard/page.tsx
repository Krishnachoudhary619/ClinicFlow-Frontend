"use client";

import QueuePanel from "@/components/queue/QueuePanel";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/user";

export default function DashboardPage() {
	const user = useAuthStore((s) => s.user);

	return (
		<div className='p-8 max-w-7xl mx-auto'>
			<div className='mb-10'>
				<h1 className='text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
					Clinic Dashboard
				</h1>
				<p className='mt-2 text-lg text-slate-600 dark:text-slate-400'>
					Manage your daily clinic operations seamlessly.
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-10'>
				{/* Information Card */}
				<div className='p-6 bg-white border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800'>
					<h2 className='text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2'>
						Active Session
					</h2>
					<p className='text-xl font-bold text-slate-900 dark:text-slate-100'>
						{user?.role === UserRole.ADMIN
							? "Administrator"
							: user?.role === UserRole.DOCTOR
								? "Physician"
								: "Reception Staff"}
					</p>
					<p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{user?.email}</p>
				</div>

				<div className='p-6 bg-white border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800'>
					<h2 className='text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2'>
						Clinic ID
					</h2>
					<p className='text-xl font-bold text-slate-900 dark:text-slate-100'>
						#{user?.clinicId || "---"}
					</p>
					<p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
						Authorized Facility
					</p>
				</div>
			</div>

			<QueuePanel />
		</div>
	);
}
