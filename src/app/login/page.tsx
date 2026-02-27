"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { loginService } from "@/lib/services/authService";
import { LoginRequest } from "@/types/auth";
import { fetchProfile } from "@/lib/services/userService";

export default function LoginPage() {
	const { register, handleSubmit } = useForm<LoginRequest>();
	const router = useRouter();
	const { setTokens, setUser } = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (data: LoginRequest) => {
		setLoading(true);
		setError("");

		const response = await loginService(data);

		if (response.success && response.data) {
			setTokens(response.data.accessToken, response.data.refreshToken);

			const profileResponse = await fetchProfile();
			if (profileResponse.success && profileResponse.data) {
				setUser(profileResponse.data);
			}

			router.replace("/dashboard");
		} else {
			setError(response.message);
		}

		setLoading(false);
	};

	return (
		<div className='flex items-center justify-center min-h-screen p-4'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-md p-8 bg-white border border-slate-200 rounded-2xl shadow-xl dark:bg-slate-900 dark:border-slate-800'>
				<div className='mb-8 text-center'>
					<h1 className='text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
						ClinicFlow
					</h1>
					<p className='mt-2 text-sm text-slate-600 dark:text-slate-400'>
						Sign in to manage your clinic queue
					</p>
				</div>

				<div className='space-y-5'>
					<div>
						<label className='block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300'>
							Email Address
						</label>
						<input
							{...register("email")}
							type='email'
							placeholder='admin@clinic.com'
							className='w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-blue-500/10'
						/>
					</div>

					<div>
						<label className='block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300'>
							Password
						</label>
						<input
							{...register("password")}
							type='password'
							placeholder='••••••••'
							className='w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:focus:ring-blue-500/10'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full py-3 px-4 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-blue-500/20'>
						{loading ? "Verifying..." : "Sign In"}
					</button>

					{error && (
						<div className='p-3 text-sm text-center text-red-600 bg-red-50 border border-red-100 rounded-lg dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400'>
							{error}
						</div>
					)}
				</div>
			</form>
		</div>
	);
}
