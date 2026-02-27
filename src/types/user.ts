export enum UserRole {
    ADMIN = "ADMIN",
    DOCTOR = "DOCTOR",
    RECEPTIONIST = "RECEPTIONIST",
}

export interface UserProfile {
    id: number;
    email: string;
    role: UserRole;
    clinicId: number;
}
