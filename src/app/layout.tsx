import "./globals.css";
import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";

export const metadata = {
	title: "ClinicFlow",
	description: "Smart Clinic Queue System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body className='bg-gray-100 text-gray-900'>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
