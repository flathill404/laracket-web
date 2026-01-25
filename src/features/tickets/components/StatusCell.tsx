import { Circle } from "lucide-react";
import { getStatusColor, getStatusLabel } from "../utils/status";

export function StatusCell({ status }: { status: string }) {
	return (
		<div className="flex items-center gap-2">
			<Circle className={`h-3 w-3 ${getStatusColor(status)}`} />
			<span className="text-sm">{getStatusLabel(status)}</span>
		</div>
	);
}
