import { format as dateFnsFormat, isPast } from "date-fns";

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;

export const DATE_FORMATS = {
	short: "MMM d",
	medium: "MMM d, yyyy",
	long: "PPP",
} as const;

export type DateFormatType = keyof typeof DATE_FORMATS;

type DateInput = Date | string;

function toDate(date: DateInput): Date {
	return typeof date === "string" ? new Date(date) : date;
}

export function formatDate(
	date: DateInput,
	formatType: DateFormatType,
): string {
	return dateFnsFormat(toDate(date), DATE_FORMATS[formatType]);
}

export function formatDateLocale(
	date: DateInput,
	options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		year: "numeric",
	},
): string {
	return toDate(date).toLocaleDateString("en-US", options);
}

export function formatRelativeTime(date: DateInput): string {
	const d = toDate(date);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

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

	return formatDateLocale(d);
}

export function isOverdue(date: DateInput): boolean {
	return isPast(toDate(date));
}

export { isPast };
