"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/dashboard");
		}
	}, [isAuthenticated, router]);

	return <>{children}</>;
}
