import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
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

	it("renders with correct ticket prop", () => {
		const onDeleteTicket = vi.fn();
		render(<ActionsCell ticket={mockTicket} onDeleteTicket={onDeleteTicket} />);

		// Menu trigger should be present
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-haspopup", "menu");
		expect(button).toHaveAttribute("aria-expanded", "false");
	});
});
