import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatRelativeTime } from "./date-utils";

describe("date-utils", () => {
	beforeEach(() => {
		// Mock current time to 2024-01-15T12:00:00Z
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("formatRelativeTime", () => {
		it("should return 'just now' for time less than a minute ago", () => {
			const date = new Date("2024-01-15T11:59:30Z").toISOString();
			expect(formatRelativeTime(date)).toBe("just now");
		});

		it("should return '1 minute ago' for exactly one minute", () => {
			const date = new Date("2024-01-15T11:59:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("1 minute ago");
		});

		it("should return minutes ago for time less than an hour", () => {
			const date = new Date("2024-01-15T11:30:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("30 minutes ago");
		});

		it("should return '1 hour ago' for exactly one hour", () => {
			const date = new Date("2024-01-15T11:00:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("1 hour ago");
		});

		it("should return hours ago for time less than a day", () => {
			const date = new Date("2024-01-15T06:00:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("6 hours ago");
		});

		it("should return '1 day ago' for exactly one day", () => {
			const date = new Date("2024-01-14T12:00:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("1 day ago");
		});

		it("should return days ago for time less than a week", () => {
			const date = new Date("2024-01-12T12:00:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("3 days ago");
		});

		it("should return formatted date for time more than a week ago", () => {
			const date = new Date("2024-01-01T12:00:00Z").toISOString();
			const result = formatRelativeTime(date);
			// The format depends on locale, but should be a date string
			expect(result).toMatch(
				/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}[-/]\d{1,2}[-/]\d{1,2}/,
			);
		});

		it("should handle edge case at exactly 59 seconds", () => {
			const date = new Date("2024-01-15T11:59:01Z").toISOString();
			expect(formatRelativeTime(date)).toBe("just now");
		});

		it("should handle edge case at exactly 23 hours 59 minutes", () => {
			const date = new Date("2024-01-14T12:01:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("23 hours ago");
		});

		it("should handle edge case at exactly 6 days 23 hours", () => {
			const date = new Date("2024-01-08T13:00:00Z").toISOString();
			expect(formatRelativeTime(date)).toBe("6 days ago");
		});
	});
});
