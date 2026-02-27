import "./globals.css";
import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
	title: "ClinicFlow",
	description: "Smart Clinic Queue System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<AuthProvider>
					{children}
					<Toaster position='top-right' />
				</AuthProvider>
			</body>
		</html>
	);
}
