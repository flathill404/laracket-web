import { Circle } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getAllStatuses,
	getStatusBadgeVariant,
	getStatusColor,
	getStatusLabel,
} from "@/features/tickets/utils";
import type { TicketStatusType } from "../api/tickets";

interface TicketStatusSelectProps {
	value: TicketStatusType;
	onValueChange: (value: TicketStatusType) => void;
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
