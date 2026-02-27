"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { fetchProfile } from "@/lib/services/userService";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const initialize = useAuthStore((state) => state.initialize);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const setUser = useAuthStore((state) => state.setUser);

	useEffect(() => {
		initialize();
	}, [initialize]);

	useEffect(() => {
		const loadProfile = async () => {
			if (isAuthenticated) {
				const response = await fetchProfile();
				if (response.success && response.data) {
					setUser(response.data);
				}
			}
		};

		loadProfile();
	}, [isAuthenticated, setUser]);

	return <>{children}</>;
}
