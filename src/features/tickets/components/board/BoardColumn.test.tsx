import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/utils";
import type { Ticket } from "../../types";
import { BoardColumn } from "./BoardColumn";

// Mock the queries module
vi.mock("../../utils/queries", () => ({
	ticketQueries: {
		list: vi.fn(() => ({
			queryKey: ["tickets-project", "list"],
			queryFn: vi.fn(),
			initialPageParam: undefined,
			getNextPageParam: () => undefined,
		})),
	},
}));

// Mock the BoardTicketCard component
vi.mock("./BoardTicketCard", () => ({
	BoardTicketCard: ({ ticket }: { ticket: Ticket }) => (
		<div data-testid={`ticket-card-${ticket.id}`}>{ticket.title}</div>
	),
}));

// Mock pragmatic drag-and-drop
vi.mock("@atlaskit/pragmatic-drag-and-drop/element/adapter", () => ({
	dropTargetForElements: vi.fn(() => vi.fn()),
}));

// Mock useSuspenseInfiniteQuery
vi.mock("@tanstack/react-query", async () => {
	const actual = (await vi.importActual("@tanstack/react-query")) as object;
	return {
		...actual,
		useSuspenseInfiniteQuery: vi.fn(() => ({
			data: {
				pages: [
					{
						data: [
							{
								id: "t1",
								title: "Ticket 1",
								description: "Description 1",
								status: "open",
								dueDate: null,
								assignees: [],
								reviewers: [],
								projectId: "p1",
								createdAt: "2024-01-28T10:00:00Z",
								updatedAt: "2024-01-28T10:00:00Z",
							},
							{
								id: "t2",
								title: "Ticket 2",
								description: "Description 2",
								status: "open",
								dueDate: null,
								assignees: [],
								reviewers: [],
								projectId: "p1",
								createdAt: "2024-01-28T10:00:00Z",
								updatedAt: "2024-01-28T10:00:00Z",
							},
						],
					},
				],
				pageParams: [undefined],
			},
			fetchNextPage: vi.fn(),
			hasNextPage: false,
			isFetchingNextPage: false,
		})),
	};
});

describe("BoardColumn", () => {
	it("renders column with status label", () => {
		render(<BoardColumn projectId="p1" status="open" />);
		// Check for status label
		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("displays ticket count", () => {
		render(<BoardColumn projectId="p1" status="open" />);
		// Should show count of 2 tickets
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("renders ticket cards container", () => {
		const { container } = render(<BoardColumn projectId="p1" status="open" />);
		// Check that virtualizer container exists
		const virtualizerContainer = container.querySelector(
			'[style*="position: relative"]',
		);
		expect(virtualizerContainer).toBeInTheDocument();
	});

	it("renders with correct status indicator", () => {
		const { container } = render(<BoardColumn projectId="p1" status="open" />);
		// Check for status indicator (bg-sky-500 for open status)
		const statusIndicator = container.querySelector(".bg-sky-500");
		expect(statusIndicator).toBeInTheDocument();
	});

	it("renders column structure", () => {
		const { container } = render(<BoardColumn projectId="p1" status="open" />);
		// Check for basic column structure
		const column = container.querySelector(".min-w-\\[280px\\]");
		expect(column).toBeInTheDocument();
	});
});
