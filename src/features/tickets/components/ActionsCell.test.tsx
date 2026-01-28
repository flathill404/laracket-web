import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import type { Ticket } from "../types";
import { ActionsCell } from "./ActionsCell";

describe("ActionsCell", () => {
	const mockTicket: Ticket = {
		id: "ticket-1",
		title: "Test Ticket",
		description: "Test description",
		status: "open",
		dueDate: null,
		assignees: [],
		reviewers: [],
		projectId: "p1",
		createdAt: "2024-01-28T10:00:00Z",
		updatedAt: "2024-01-28T10:00:00Z",
	};

	it("renders actions menu trigger", () => {
		render(<ActionsCell ticket={mockTicket} />);
		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(screen.getByText("Open menu")).toBeInTheDocument();
	});
});
