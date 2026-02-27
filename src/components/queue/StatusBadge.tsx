import { TokenStatus } from "@/types/queue";
import clsx from "clsx";

interface Props {
	status: TokenStatus;
}

export default function StatusBadge({ status }: Props) {
	const styles = {
		WAITING:
			"bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30",
		CALLED: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30",
		SERVED: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30",
		DELAYED:
			"bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/30",
	};

	return (
		<span
			className={clsx(
				"px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border",
				styles[status] ||
					"bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
			)}>
			{status}
		</span>
	);
}
