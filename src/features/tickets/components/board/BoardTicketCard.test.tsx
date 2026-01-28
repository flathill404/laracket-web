import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import type { Ticket } from "../../types";
import { BoardTicketCard } from "./BoardTicketCard";

describe("BoardTicketCard", () => {
	const mockTicket: Ticket = {
		id: "ticket-123",
		title: "Test Ticket Title",
		description: "Test ticket description",
		status: "open",
		dueDate: null,
		assignees: [],
		reviewers: [],
		projectId: "p1",
		createdAt: "2024-01-28T10:00:00Z",
		updatedAt: "2024-01-28T10:00:00Z",
	};

	it("renders ticket title and description", () => {
		render(<BoardTicketCard ticket={mockTicket} />);
		expect(screen.getByText("Test Ticket Title")).toBeInTheDocument();
		expect(screen.getByText("Test ticket description")).toBeInTheDocument();
	});

	it("displays truncated ticket ID", () => {
		render(<BoardTicketCard ticket={mockTicket} />);
		// ID is sliced to first 8 characters
		expect(screen.getByText("ticket-1")).toBeInTheDocument();
	});

	it("renders with assignees", () => {
		const ticketWithAssignees = {
			...mockTicket,
			assignees: [
				{
					id: "u1",
					name: "user1",
					displayName: "User 1",
					avatarUrl: null,
				},
			],
		};
		render(<BoardTicketCard ticket={ticketWithAssignees} />);
		// UserAvatarStack renders initials from displayName
		expect(screen.getByText("US")).toBeInTheDocument();
	});

	it("shows empty state when no assignees", () => {
		render(<BoardTicketCard ticket={mockTicket} />);
		// Empty content with "?" should be shown
		expect(screen.getByText("?")).toBeInTheDocument();
	});

	it("displays due date when present", () => {
		const ticketWithDueDate = {
			...mockTicket,
			dueDate: "2024-12-31T23:59:59Z",
		};
		const { container } = render(
			<BoardTicketCard ticket={ticketWithDueDate} />,
		);
		// Date should be formatted and displayed
		const dateSpans = container.querySelectorAll(".text-muted-foreground");
		// Should have at least the date span (in addition to ID span)
		expect(dateSpans.length).toBeGreaterThan(1);
	});

	it("highlights overdue tickets", () => {
		const overdueTicket = {
			...mockTicket,
			status: "in_progress" as const,
			dueDate: "2020-01-01T00:00:00Z", // Past date
		};
		const { container } = render(<BoardTicketCard ticket={overdueTicket} />);
		// Should have destructive text color class
		const destructiveElement = container.querySelector(".text-destructive");
		expect(destructiveElement).toBeInTheDocument();
	});

	it("does not highlight overdue for resolved/closed tickets", () => {
		const resolvedOverdueTicket = {
			...mockTicket,
			status: "resolved" as const,
			dueDate: "2020-01-01T00:00:00Z", // Past date
		};
		const { container } = render(
			<BoardTicketCard ticket={resolvedOverdueTicket} />,
		);
		// Should NOT have destructive text color class
		const destructiveElement = container.querySelector(".text-destructive");
		expect(destructiveElement).not.toBeInTheDocument();
	});

	it("has draggable cursor classes", () => {
		const { container } = render(<BoardTicketCard ticket={mockTicket} />);
		const card = container.querySelector(".cursor-grab");
		expect(card).toBeInTheDocument();
	});
});
