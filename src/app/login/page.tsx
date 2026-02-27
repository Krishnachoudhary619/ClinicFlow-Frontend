"use client";

import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

type LoginForm = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const { register, handleSubmit } = useForm<LoginForm>();
	const router = useRouter();
	const [error, setError] = useState("");
	const { setToken } = useAuthStore();

	const onSubmit = async (data: LoginForm) => {
		try {
			const response = await api.post("/auth/login", data);

			if (response.data.success) {
				setToken(response.data.data.accessToken);
				router.replace("/dashboard");
			} else {
				setError(response.data.message);
			}
		} catch (err: any) {
			setError("Login failed");
		}
	};

	return (
		<div className='flex items-center justify-center h-screen'>
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

				<button type='submit' className='w-full bg-blue-600 text-white p-2 rounded'>
					Login
				</button>

				{error && <p className='text-red-500 mt-3 text-sm text-center'>{error}</p>}
			</form>
		</div>
	);
}
