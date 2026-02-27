import { UserRole } from "@/types/user";

export function hasRole(
    userRole: UserRole | undefined,
    allowedRoles: UserRole[]
): boolean {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
}
