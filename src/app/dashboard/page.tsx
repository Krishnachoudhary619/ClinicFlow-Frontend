"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { ENDPOINTS } from "@/lib/endpoints";

export default function DashboardPage() {
	const [queue, setQueue] = useState<any>(null);

	const fetchQueue = async () => {
		const response = await apiRequest<any>("get", ENDPOINTS.QUEUE.CURRENT);
		if (response.success) {
			setQueue(response.data);
		}
	};

	useEffect(() => {
		fetchQueue();
	}, []);

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Clinic Dashboard</h1>

			{queue ? (
				<div>
					<p>Current Serving: {queue.currentServing?.tokenNumber || "None"}</p>
					<p>Waiting Count: {queue.waitingCount}</p>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
