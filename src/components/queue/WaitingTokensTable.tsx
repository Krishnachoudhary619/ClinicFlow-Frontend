"use client";

import { Token } from "@/types/queue";
import StatusBadge from "./StatusBadge";

interface Props {
	tokens: Token[];
}

export default function WaitingTokensTable({ tokens }: Props) {
	return (
		<div>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-sm font-semibold uppercase tracking-wider text-slate-400'>
					Upcoming Patients
				</h3>
				<span className='px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-black rounded-md border border-slate-700'>
					{tokens.length} IN QUEUE
				</span>
			</div>

			{!tokens.length ? (
				<div className='flex flex-col items-center justify-center py-10 text-center'>
					<p className='text-slate-500 font-medium text-sm'>
						Queue is empty. New tokens will appear here.
					</p>
				</div>
			) : (
				<div className='overflow-x-auto'>
					<table className='min-w-full'>
						<thead>
							<tr className='border-b border-slate-800'>
								<th className='px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
									Token
								</th>
								<th className='px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
									Patient
								</th>
								<th className='px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
									Contact
								</th>
								<th className='px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
									Cycle
								</th>
								<th className='px-4 py-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
									Status
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-slate-800/50'>
							{tokens.map((token) => (
								<tr
									key={token.id}
									className='transition-colors group hover:bg-slate-800/30'>
									<td className='px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-400'>
										#{token.tokenNumber}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-200 capitalize'>
										{token.patientName || "---"}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-slate-400 tabular-nums'>
										{token.patientPhone || "---"}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-slate-500 tabular-nums'>
										C{token.cycleNumber}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-right'>
										<StatusBadge status={token.status} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
