const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;

export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < SECONDS_IN_MINUTE) {
		return "just now";
	}

	if (diffInSeconds < SECONDS_IN_HOUR) {
		const minutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE);
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	}

	if (diffInSeconds < SECONDS_IN_DAY) {
		const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR);
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	}

	if (diffInSeconds < SECONDS_IN_WEEK) {
		const days = Math.floor(diffInSeconds / SECONDS_IN_DAY);
		return `${days} day${days === 1 ? "" : "s"} ago`;
	}

	return date.toLocaleDateString();
}
