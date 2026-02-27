"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { loginService } from "@/lib/services/authService";
import { LoginRequest } from "@/types/auth";

export default function LoginPage() {
	const { register, handleSubmit } = useForm<LoginRequest>();
	const router = useRouter();
	const { setToken } = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (data: LoginRequest) => {
		setLoading(true);
		setError("");

		const response = await loginService(data);

		if (response.success && response.data) {
			setToken(response.data.accessToken);
			router.replace("/dashboard");
		} else {
			setError(response.message);
		}

		setLoading(false);
	};

	return (
		<div className='flex items-center justify-center h-screen bg-gray-100'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-white p-8 rounded-lg shadow-md w-96'>
				<h1 className='text-xl font-bold mb-6 text-center'>ClinicFlow Login</h1>

				<input
					{...register("email")}
					placeholder='Email'
					className='w-full border p-2 mb-4 rounded'
				/>

				<input
					{...register("password")}
					type='password'
					placeholder='Password'
					className='w-full border p-2 mb-4 rounded'
				/>

				<button
					type='submit'
					disabled={loading}
					className='w-full bg-blue-600 text-white p-2 rounded'>
					{loading ? "Logging in..." : "Login"}
				</button>

				{error && <p className='text-red-500 mt-3 text-sm text-center'>{error}</p>}
			</form>
		</div>
	);
}
