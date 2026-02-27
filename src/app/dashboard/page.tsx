"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function DashboardPage() {
	const [queue, setQueue] = useState<any>(null);

	const fetchQueue = async () => {
		const response = await api.get("/queue/current");
		if (response.data.success) {
			setQueue(response.data.data);
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
