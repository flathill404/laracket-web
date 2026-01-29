import type { Column } from "@tanstack/react-table";
import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import type { Ticket } from "../types";
import { DueDateHeader } from "./DueDateHeader";

describe("DueDateHeader", () => {
	const createMockColumn = (
		sorted: false | "asc" | "desc" = false,
	): Column<Ticket> =>
		({
			getIsSorted: vi.fn(() => sorted),
			toggleSorting: vi.fn(),
		}) as unknown as Column<Ticket>;

	it("renders the header label", () => {
		const column = createMockColumn();
		render(<DueDateHeader column={column} />);
		expect(screen.getByText("Due Date")).toBeInTheDocument();
	});

	it("shows the unsorted icon by default", () => {
		const column = createMockColumn(false);
		render(<DueDateHeader column={column} />);
		// ArrowUpDown icon should be present
		const button = screen.getByRole("button");
		expect(button).toBeInTheDocument();
	});

	it("shows the ascending arrow when sorted asc", () => {
		const column = createMockColumn("asc");
		const { container } = render(<DueDateHeader column={column} />);
		// Check for primary color class (indicating sorted state)
		const icon = container.querySelector(".text-primary");
		expect(icon).toBeInTheDocument();
	});

	it("shows the descending arrow when sorted desc", () => {
		const column = createMockColumn("desc");
		const { container } = render(<DueDateHeader column={column} />);
		// Check for primary color class
		const icon = container.querySelector(".text-primary");
		expect(icon).toBeInTheDocument();
	});

	it("calls toggleSorting on click", () => {
		const column = createMockColumn();
		render(<DueDateHeader column={column} />);

		const button = screen.getByRole("button");
		fireEvent.click(button);

		expect(column.toggleSorting).toHaveBeenCalled();
	});
});
