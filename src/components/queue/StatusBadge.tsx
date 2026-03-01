import { TokenStatus } from "@/types/queue";
import clsx from "clsx";

interface Props {
	status: TokenStatus;
}

export default function StatusBadge({ status }: Props) {
	const styles = {
		WAITING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
		CALLED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
		SERVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
		DELAYED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
	};

	return (
		<span
			className={clsx(
				"px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border inline-flex items-center justify-center min-w-[60px]",
				styles[status] || "bg-slate-800 text-slate-400 border-slate-700",
			)}>
			{status}
		</span>
	);
}
