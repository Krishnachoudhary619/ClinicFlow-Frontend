"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isInitialized = useAuthStore((state) => state.isInitialized);

	useEffect(() => {
		if (isInitialized && !isAuthenticated) {
			router.replace("/login");
		}
	}, [isInitialized, isAuthenticated, router]);

	if (!isInitialized || !isAuthenticated) {
		return null; // prevent flash during initialization
	}

	return <div className='min-h-screen'>{children}</div>;
}
