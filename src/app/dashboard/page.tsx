"use client";

import { useAuthStore } from "@/store/authStore";
import RoleGuard from "@/components/RoleGuard";
import { UserRole } from "@/types/user";

export default function DashboardPage() {
	const user = useAuthStore((s) => s.user);

	return (
		<div className='p-8 max-w-7xl mx-auto text-slate-900 dark:text-slate-100'>
			<div className='mb-10'>
				<h1 className='text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
					Clinic Dashboard
				</h1>
				<p className='mt-2 text-lg text-slate-600 dark:text-slate-400'>
					Manage your daily clinic operations seamlessly.
				</p>
			</div>

			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
				{/* Information Card */}
				<div className='p-6 bg-white border border-slate-200 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800'>
					<h2 className='text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2'>
						Active Session
					</h2>
					<p className='text-xl font-bold'>
						{user?.role === UserRole.ADMIN
							? "Administrator"
							: user?.role === UserRole.DOCTOR
								? "Physician"
								: "Reception Staff"}
					</p>
					<p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>{user?.email}</p>
				</div>
			</div>

			<div className='mt-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm dark:bg-slate-900 dark:border-slate-800'>
				<h2 className='text-2xl font-bold mb-8 text-slate-800 dark:text-slate-200'>
					Quick Actions
				</h2>

				<div className='flex flex-wrap gap-4'>
					{/* ADMIN ONLY - Critical Operations */}
					<RoleGuard allowed={[UserRole.ADMIN]}>
						<button className='bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all shadow-lg shadow-purple-500/20'>
							Start New Day
						</button>
					</RoleGuard>

					{/* ADMIN + RECEPTIONIST - Front desk tasks */}
					<RoleGuard allowed={[UserRole.ADMIN, UserRole.RECEPTIONIST]}>
						<button className='bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20'>
							Generate Token
						</button>
					</RoleGuard>

					{/* DOCTOR + RECEPTIONIST + ADMIN - Core flow */}
					<RoleGuard allowed={[UserRole.DOCTOR, UserRole.RECEPTIONIST, UserRole.ADMIN]}>
						<button className='bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20'>
							Serve Next Patient
						</button>
					</RoleGuard>
				</div>
			</div>
		</div>
	);
}
