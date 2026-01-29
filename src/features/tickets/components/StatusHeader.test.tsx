import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { StatusHeader } from "./StatusHeader";

describe("StatusHeader", () => {
	it("renders the Status label", () => {
		render(<StatusHeader selectedStatuses={[]} />);
		expect(screen.getByText("Status")).toBeInTheDocument();
	});

	it("shows the filter count badge when statuses are selected", () => {
		render(<StatusHeader selectedStatuses={["open", "in_progress"]} />);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("does not show the badge when no statuses are selected", () => {
		render(<StatusHeader selectedStatuses={[]} />);
		const badge = screen.queryByText(/\d+/);
		expect(badge).not.toBeInTheDocument();
	});

	it("opens the popover on trigger click", async () => {
		render(<StatusHeader selectedStatuses={[]} />);

		const trigger = screen.getByRole("button");
		fireEvent.click(trigger);

		// Check for status options
		expect(await screen.findByText("Open")).toBeInTheDocument();
		expect(screen.getByText("In Progress")).toBeInTheDocument();
	});

	it("calls onStatusChange when a status is selected", async () => {
		const onStatusChange = vi.fn();
		render(
			<StatusHeader selectedStatuses={[]} onStatusChange={onStatusChange} />,
		);

		// Open popover
		fireEvent.click(screen.getByRole("button"));

		// Select a status
		const openStatus = await screen.findByText("Open");
		fireEvent.click(openStatus);

		expect(onStatusChange).toHaveBeenCalledWith(["open"]);
	});

	it("shows the clear filters option when statuses are selected", async () => {
		render(<StatusHeader selectedStatuses={["open"]} />);

		// Open popover
		fireEvent.click(screen.getByRole("button"));

		expect(await screen.findByText("Clear filters")).toBeInTheDocument();
	});

	it("clears all filters when clear filters is clicked", async () => {
		const onStatusChange = vi.fn();
		render(
			<StatusHeader
				selectedStatuses={["open", "in_progress"]}
				onStatusChange={onStatusChange}
			/>,
		);

		// Open popover
		fireEvent.click(screen.getByRole("button"));

		// Click clear filters
		const clearButton = await screen.findByText("Clear filters");
		fireEvent.click(clearButton);

		expect(onStatusChange).toHaveBeenCalledWith([]);
	});
});
