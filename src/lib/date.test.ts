import { describe, expect, it, vi } from "vitest";
import {
	formatDate,
	formatDateLocale,
	formatRelativeTime,
	isOverdue,
} from "./date";

describe("date utils", () => {
	const testDate = new Date("2023-01-15T12:00:00Z");

	describe("formatDate", () => {
		it("formats the short date correctly", () => {
			expect(formatDate(testDate, "short")).toBe("Jan 15");
		});

		it("formats the medium date correctly", () => {
			expect(formatDate(testDate, "medium")).toBe("Jan 15, 2023");
		});

		it("formats the long date correctly", () => {
			expect(formatDate(testDate, "long")).toBe("January 15th, 2023");
		});

		it("handles a string input", () => {
			expect(formatDate("2023-01-15T12:00:00Z", "short")).toBe("Jan 15");
		});
	});

	describe("formatDateLocale", () => {
		it("formats with the default options", () => {
			// Depending on the test environment locale, this might vary.
			// Assuming EN locale for node/vitest environment as is common.
			expect(formatDateLocale(testDate)).toBe("Jan 15, 2023");
		});

		it("formats with custom options", () => {
			expect(
				formatDateLocale(testDate, {
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
			).toBe("Sunday, January 15, 2023");
		});
	});

	describe("formatRelativeTime", () => {
		it("returns 'just now' for times less than a minute ago", () => {
			const now = new Date();
			const justNow = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
			expect(formatRelativeTime(justNow)).toBe("just now");
		});

		it("returns minutes ago", () => {
			const now = new Date();
			const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
			expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
		});

		it("returns 1 minute ago correctly", () => {
			const now = new Date();
			const oneMinuteAgo = new Date(now.getTime() - 65 * 1000);
			expect(formatRelativeTime(oneMinuteAgo)).toBe("1 minute ago");
		});

		it("returns hours ago", () => {
			const now = new Date();
			const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
			expect(formatRelativeTime(twoHoursAgo)).toBe("2 hours ago");
		});

		it("returns days ago", () => {
			const now = new Date();
			const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
			expect(formatRelativeTime(threeDaysAgo)).toBe("3 days ago");
		});

		it("falls back to standard formatting for longer periods (more than a week)", () => {
			// Mocking system time to ensure consistent diff
			const systemTime = new Date("2023-02-01T12:00:00Z");
			vi.useFakeTimers();
			vi.setSystemTime(systemTime);

			const oldDate = new Date("2023-01-01T12:00:00Z");
			expect(formatRelativeTime(oldDate)).toBe("Jan 1, 2023");

			vi.useRealTimers();
		});
	});

	describe("isOverdue", () => {
		it("returns true for past dates", () => {
			const pastDate = new Date("2000-01-01");
			expect(isOverdue(pastDate)).toBe(true);
		});

		it("returns false for future dates", () => {
			// Ensure future date relative to real time execution
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1);
			expect(isOverdue(futureDate)).toBe(false);
		});
	});
});
