import {
	ALL_STATUSES,
	STATUS_BADGE_VARIANTS,
	STATUS_COLORS,
	STATUS_LABELS,
	type TicketStatus,
} from "./constants";

const DEFAULT_COLOR = "text-slate-500 fill-slate-500";
const DEFAULT_BADGE_VARIANT =
	"text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900";

export const getStatusColor = (status: string): string => {
	if (status in STATUS_COLORS) {
		return STATUS_COLORS[status as TicketStatus];
	}
	return DEFAULT_COLOR;
};

export const getStatusBadgeVariant = (status: string): string => {
	if (status in STATUS_BADGE_VARIANTS) {
		return STATUS_BADGE_VARIANTS[status as TicketStatus];
	}
	return DEFAULT_BADGE_VARIANT;
};

export const getAllStatuses = (): TicketStatus[] => ALL_STATUSES;

export const getStatusLabel = (status: string): string => {
	if (status in STATUS_LABELS) {
		return STATUS_LABELS[status as TicketStatus];
	}
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
