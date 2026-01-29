import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DueDateCell } from "./DueDateCell";

describe("DueDateCell", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-06-15T12:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders a dash when dueDate is null", () => {
		render(<DueDateCell dueDate={null} />);

		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("renders a dash when dueDate is undefined", () => {
		render(<DueDateCell dueDate={undefined} />);

		expect(screen.getByText("—")).toBeInTheDocument();
	});

	it("renders a formatted date for a future due date", () => {
		render(<DueDateCell dueDate="2024-12-31T12:00:00Z" />);

		// The exact format depends on locale, just check it renders a date span
		const dateSpan = document.querySelector(
			"span.text-sm:not(.text-muted-foreground)",
		);
		expect(dateSpan).toBeInTheDocument();
		expect(dateSpan?.textContent).toMatch(/Dec\s+31,\s+2024/);
	});

	it("does not apply the destructive class for a future due date", () => {
		render(<DueDateCell dueDate="2024-12-31T12:00:00Z" />);

		const dateElement = document.querySelector(
			"span.text-sm:not(.text-muted-foreground)",
		);
		expect(dateElement).not.toHaveClass("text-destructive");
	});

	it("applies the destructive class for a past due date", () => {
		render(<DueDateCell dueDate="2024-01-01T00:00:00Z" />);

		const dateElement = screen.getByText("Jan 1, 2024");
		expect(dateElement).toHaveClass("text-destructive");
		expect(dateElement).toHaveClass("font-medium");
	});

	it("formats the date correctly for various dates", () => {
		const { rerender } = render(<DueDateCell dueDate="2024-07-04T00:00:00Z" />);
		expect(screen.getByText("Jul 4, 2024")).toBeInTheDocument();

		rerender(<DueDateCell dueDate="2025-01-15T00:00:00Z" />);
		expect(screen.getByText("Jan 15, 2025")).toBeInTheDocument();
	});
});
