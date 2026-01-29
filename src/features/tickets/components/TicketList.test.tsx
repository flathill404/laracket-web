import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Ticket } from "@/features/tickets/types";
import { render } from "@/test/utils";
import { TicketList } from "./TicketList";

// Mock columns to avoid complex dependencies
vi.mock("./columns", () => ({
	columns: [
		{
			accessorKey: "title",
			header: "Title",
			cell: (info: { getValue: () => unknown }) => info.getValue(),
		},
	],
}));

// Mock ResizeObserver
window.ResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock Virtualizer to render all items (bypass virtualization)
vi.mock("@tanstack/react-virtual", () => ({
	useVirtualizer: ({ count }: { count: number }) => ({
		getVirtualItems: () =>
			Array.from({ length: count }).map((_, i) => ({
				index: i,
				size: 65,
				start: i * 65,
				key: i,
			})),
		getTotalSize: () => count * 65,
	}),
}));

describe("TicketList", () => {
	const mockTickets = [
		{ id: "1", title: "Ticket 1" },
		{ id: "2", title: "Ticket 2" },
	] as unknown as Ticket[];

	it("should render tickets in simple mode", () => {
		render(<TicketList tickets={mockTickets} onTicketClick={vi.fn()} />);

		expect(screen.getByText("Ticket 1")).toBeInTheDocument();
		expect(screen.getByText("Ticket 2")).toBeInTheDocument();
		expect(screen.getByText("Showing 2 tickets")).toBeInTheDocument();
	});

	it("should render empty state", () => {
		render(
			<TicketList
				tickets={[]}
				onTicketClick={vi.fn()}
				emptyState="Custom Empty"
			/>,
		);

		expect(screen.getByText("Custom Empty")).toBeInTheDocument();
	});
});
