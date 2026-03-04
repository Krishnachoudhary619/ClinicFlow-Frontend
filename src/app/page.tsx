"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const activeToken = localStorage.getItem("activeToken");
		if (activeToken) {
			router.push(`/track/${activeToken}`);
		} else {
			// If no active token, redirect to dashboard by default or login
			// For now, let's redirect to dashboard which will handle auth
			router.push("/dashboard");
		}
	}, [router]);

	return (
		<div className='min-h-screen bg-slate-950 flex items-center justify-center'>
			<div className='animate-pulse text-slate-500 font-medium'>Redirecting...</div>
		</div>
	);
}
