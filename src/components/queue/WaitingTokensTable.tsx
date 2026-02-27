"use client";

import { Token } from "@/types/queue";
import StatusBadge from "./StatusBadge";

interface Props {
	tokens: Token[];
}

export default function WaitingTokensTable({ tokens }: Props) {
	return (
		<div className='mt-10'>
			<div className='flex items-center justify-between mb-6'>
				<h3 className='text-lg font-bold text-slate-900 dark:text-white'>
					Upcoming Tokens
				</h3>
				<span className='px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full dark:bg-slate-800 dark:text-slate-400'>
					{tokens.length} {tokens.length === 1 ? "Patient" : "Patients"}
				</span>
			</div>

			{!tokens.length ? (
				<div className='flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl dark:border-slate-800'>
					<div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800'>
						<svg
							className='w-6 h-6 text-slate-400'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
					</div>
					<p className='text-slate-500 font-medium dark:text-slate-400'>
						No patients currently in waitlist.
					</p>
				</div>
			) : (
				<div className='overflow-hidden border border-slate-200 rounded-2xl dark:border-slate-800'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-slate-200 dark:divide-slate-800'>
							<thead className='bg-slate-50 dark:bg-slate-900/50'>
								<tr>
									<th className='px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500'>
										Token
									</th>
									<th className='px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500'>
										Patient Name
									</th>
									<th className='px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500'>
										Phone Number
									</th>
									<th className='px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500'>
										Cycle
									</th>
									<th className='px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500'>
										Status
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-900 dark:divide-slate-800'>
								{tokens.map((token) => (
									<tr
										key={token.id}
										className='hover:bg-slate-50 transition-colors dark:hover:bg-slate-800/50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-black text-blue-600 dark:text-blue-400'>
											#{token.tokenNumber}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white capitalize'>
											{token.patientName || "---"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400 tabular-nums'>
											{token.patientPhone || "---"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400 tabular-nums'>
											C{token.cycleNumber}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<StatusBadge status={token.status} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
