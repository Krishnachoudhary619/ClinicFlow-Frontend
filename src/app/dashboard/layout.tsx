"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace("/login");
		}
	}, [isAuthenticated, router]);

	if (!isAuthenticated) {
		return null; // prevent flash
	}

	return <div className='min-h-screen bg-gray-100'>{children}</div>;
}
