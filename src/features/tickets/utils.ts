export const getStatusColor = (status: string) => {
	if (status === "open") {
		return "text-sky-500 fill-sky-500";
	}

	if (status === "in_progress") {
		return "text-yellow-500 fill-yellow-500";
	}

	if (status === "in_review") {
		return "text-indigo-500 fill-indigo-500";
	}

	if (status === "resolved") {
		return "text-emerald-500 fill-emerald-500";
	}

	if (status === "closed") {
		return "text-slate-500 fill-slate-500";
	}

	console.warn(`Unknown status: ${status}`);
	return "text-slate-500 fill-slate-500";
};

export const getStatusBadgeVariant = (status: string) => {
	if (status === "open") {
		return "text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-300 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-900";
	}

	if (status === "in_progress") {
		return "text-yellow-700 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900";
	}

	if (status === "in_review") {
		return "text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900";
	}

	if (status === "resolved") {
		return "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900";
	}

	if (status === "closed") {
		return "text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900";
	}

	return "text-slate-700 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-900";
};

export const getAllStatuses = () => [
	"open",
	"in_progress",
	"in_review",
	"resolved",
	"closed",
];

export const getStatusLabel = (status: string) => {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
