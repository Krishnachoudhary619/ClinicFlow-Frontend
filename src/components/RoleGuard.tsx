"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/user";
import { hasRole } from "@/lib/role";

interface Props {
	allowed: UserRole[];
	children: ReactNode;
}

export default function RoleGuard({ allowed, children }: Props) {
	const user = useAuthStore((s) => s.user);

	// Since user?.role is an enum and allowed is an array of enums, this works perfectly.
	if (!user?.role || !hasRole(user.role, allowed)) {
		return null;
	}

	return <>{children}</>;
}
