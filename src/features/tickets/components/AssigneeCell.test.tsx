import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Ticket } from "../types";
import { AssigneeCell } from "./AssigneeCell";

type Assignee = Ticket["assignees"][number];

const createAssignee = (overrides: Partial<Assignee> = {}): Assignee => ({
	id: "user-123",
	name: "johndoe",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
	...overrides,
});

describe("AssigneeCell", () => {
	it("renders 'Unassigned' when there are no assignees", () => {
		render(<AssigneeCell assignees={[]} />);

		expect(screen.getByText("Unassigned")).toBeInTheDocument();
	});

	it("renders a single assignee display name", () => {
		const assignees = [createAssignee({ displayName: "Alice Smith" })];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("Alice Smith")).toBeInTheDocument();
	});

	it("renders the avatar fallback with the first two letters of displayName uppercase", () => {
		const assignees = [
			createAssignee({ displayName: "Bob Jones", avatarUrl: null }),
		];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("BO")).toBeInTheDocument();
	});

	it("renders multiple assignees as avatars only", () => {
		const assignees = [
			createAssignee({ id: "1", displayName: "Alice Smith" }),
			createAssignee({ id: "2", displayName: "Bob Jones" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		// Should not show names for multiple assignees
		expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
		expect(screen.queryByText("Bob Jones")).not.toBeInTheDocument();

		// Should show avatar fallbacks based on displayName
		expect(screen.getByText("AL")).toBeInTheDocument();
		expect(screen.getByText("BO")).toBeInTheDocument();
	});

	it("shows max 3 avatars and a +N indicator for more", () => {
		const assignees = [
			createAssignee({ id: "1", displayName: "Alice Smith" }),
			createAssignee({ id: "2", displayName: "Bob Jones" }),
			createAssignee({ id: "3", displayName: "Charlie Brown" }),
			createAssignee({ id: "4", displayName: "David Lee" }),
			createAssignee({ id: "5", displayName: "Eve Wilson" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		// Should show first 3 avatars based on displayName
		expect(screen.getByText("AL")).toBeInTheDocument();
		expect(screen.getByText("BO")).toBeInTheDocument();
		expect(screen.getByText("CH")).toBeInTheDocument();

		// Should not show 4th and 5th
		expect(screen.queryByText("DA")).not.toBeInTheDocument();
		expect(screen.queryByText("EV")).not.toBeInTheDocument();

		// Should show +2 indicator
		expect(screen.getByText("+2")).toBeInTheDocument();
	});

	it("shows +1 for exactly 4 assignees", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
			createAssignee({ id: "3", name: "charlie" }),
			createAssignee({ id: "4", name: "david" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("does not show the +N indicator for exactly 3 assignees", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
			createAssignee({ id: "3", name: "charlie" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
	});
});
