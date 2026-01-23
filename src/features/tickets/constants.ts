export const TICKET_STATUS_VALUES = [
	"open",
	"in_progress",
	"in_review",
	"resolved",
	"closed",
] as const;

export type TicketStatus = (typeof TICKET_STATUS_VALUES)[number];

export const TICKET_STATUSES = {
	open: "open",
	in_progress: "in_progress",
	in_review: "in_review",
	resolved: "resolved",
	closed: "closed",
} as const satisfies Record<string, TicketStatus>;

export const STATUS_COLORS: Record<TicketStatus, string> = {
	open: "text-sky-500 fill-sky-500",
	in_progress: "text-yellow-500 fill-yellow-500",
	in_review: "text-indigo-500 fill-indigo-500",
	resolved: "text-emerald-500 fill-emerald-500",
	closed: "text-slate-500 fill-slate-500",
};

export const STATUS_BG_COLORS: Record<TicketStatus, string> = {
	open: "bg-sky-500",
	in_progress: "bg-yellow-500",
	in_review: "bg-indigo-500",
	resolved: "bg-emerald-500",
	closed: "bg-slate-500",
};

export const STATUS_BADGE_VARIANTS: Record<TicketStatus, string> = {
	open: "text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-300 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900",
	in_progress:
		"text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900",
	in_review:
		"text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900",
	resolved:
		"text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900",
	closed:
		"text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
	open: "Open",
	in_progress: "In Progress",
	in_review: "In Review",
	resolved: "Resolved",
	closed: "Closed",
};

export const ALL_STATUSES: TicketStatus[] = [
	TICKET_STATUSES.open,
	TICKET_STATUSES.in_progress,
	TICKET_STATUSES.in_review,
	TICKET_STATUSES.resolved,
	TICKET_STATUSES.closed,
];
