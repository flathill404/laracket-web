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

export const getStatusLabel = (status: string) => {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
