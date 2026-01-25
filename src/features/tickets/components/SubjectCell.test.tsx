import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Ticket } from "../types";
import { SubjectCell } from "./SubjectCell";

const createMockTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
	id: "ticket-12345678-abcd-efgh-ijkl-mnopqrstuvwx",
	title: "Test Ticket Title",
	description: "This is a test ticket description",
	status: "open",
	dueDate: null,
	assignees: [],
	reviewers: [],
	projectId: "project-123",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
	...overrides,
});

describe("SubjectCell", () => {
	it("should render ticket title", () => {
		const ticket = createMockTicket({ title: "Fix login bug" });
		render(<SubjectCell ticket={ticket} />);

		expect(screen.getByText(/Fix login bug/)).toBeInTheDocument();
	});

	it("should render ticket ID prefix with last 8 characters", () => {
		const ticket = createMockTicket({
			id: "abcd1234",
		});
		render(<SubjectCell ticket={ticket} />);

		expect(screen.getByText(/\[T-abcd1234\]/)).toBeInTheDocument();
	});

	it("should render ticket description", () => {
		const ticket = createMockTicket({
			description: "Users cannot log in with valid credentials",
		});
		render(<SubjectCell ticket={ticket} />);

		expect(
			screen.getByText("Users cannot log in with valid credentials"),
		).toBeInTheDocument();
	});

	it("should render empty description", () => {
		const ticket = createMockTicket({ description: "" });
		render(<SubjectCell ticket={ticket} />);

		const descriptionElement = document.querySelector(".text-muted-foreground");
		expect(descriptionElement).toBeInTheDocument();
	});

	it("should combine ID and title in same element", () => {
		const ticket = createMockTicket({
			id: "abcd1234-5678-9012-3456-789012345678",
			title: "Important Feature",
		});
		render(<SubjectCell ticket={ticket} />);

		expect(
			screen.getByText("[T-12345678] Important Feature"),
		).toBeInTheDocument();
	});
});
