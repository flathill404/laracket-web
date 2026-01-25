import { Circle } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TicketStatus } from "../types";
import {
	getAllStatuses,
	getStatusBadgeVariant,
	getStatusColor,
	getStatusLabel,
} from "../utils/status";

interface TicketStatusSelectProps {
	value: TicketStatus;
	onValueChange: (value: TicketStatus) => void;
	className?: string;
}

export function TicketStatusSelect({
	value,
	onValueChange,
	className,
}: TicketStatusSelectProps) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger
				className={`h-8 w-[160px] gap-2 border-dashed ${getStatusBadgeVariant(
					value,
				)} ${className}`}
			>
				<SelectValue placeholder="Select status" />
			</SelectTrigger>
			<SelectContent position="popper">
				{getAllStatuses().map((status) => (
					<SelectItem key={status} value={status}>
						<div className="flex items-center gap-2">
							<Circle className={`h-2 w-2 ${getStatusColor(status)}`} />
							<span>{getStatusLabel(status)}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
