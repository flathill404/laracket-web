import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssigneeCell } from "./assignee-cell";
import type { Ticket } from "./types";

type Assignee = Ticket["assignees"][number];

const createAssignee = (overrides: Partial<Assignee> = {}): Assignee => ({
	id: "user-123",
	name: "johndoe",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
	...overrides,
});

describe("AssigneeCell", () => {
	it("should render 'Unassigned' when no assignees", () => {
		render(<AssigneeCell assignees={[]} />);

		expect(screen.getByText("Unassigned")).toBeInTheDocument();
	});

	it("should render single assignee name", () => {
		const assignees = [createAssignee({ name: "alice" })];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("alice")).toBeInTheDocument();
	});

	it("should render avatar fallback with first two letters uppercase", () => {
		const assignees = [createAssignee({ name: "bob", avatarUrl: null })];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("BO")).toBeInTheDocument();
	});

	it("should render multiple assignees as avatars only", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		// Should not show names for multiple assignees
		expect(screen.queryByText("alice")).not.toBeInTheDocument();
		expect(screen.queryByText("bob")).not.toBeInTheDocument();

		// Should show avatar fallbacks
		expect(screen.getByText("AL")).toBeInTheDocument();
		expect(screen.getByText("BO")).toBeInTheDocument();
	});

	it("should show max 3 avatars and +N indicator for more", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
			createAssignee({ id: "3", name: "charlie" }),
			createAssignee({ id: "4", name: "david" }),
			createAssignee({ id: "5", name: "eve" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		// Should show first 3 avatars
		expect(screen.getByText("AL")).toBeInTheDocument();
		expect(screen.getByText("BO")).toBeInTheDocument();
		expect(screen.getByText("CH")).toBeInTheDocument();

		// Should not show 4th and 5th
		expect(screen.queryByText("DA")).not.toBeInTheDocument();
		expect(screen.queryByText("EV")).not.toBeInTheDocument();

		// Should show +2 indicator
		expect(screen.getByText("+2")).toBeInTheDocument();
	});

	it("should show +1 for exactly 4 assignees", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
			createAssignee({ id: "3", name: "charlie" }),
			createAssignee({ id: "4", name: "david" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.getByText("+1")).toBeInTheDocument();
	});

	it("should not show +N indicator for exactly 3 assignees", () => {
		const assignees = [
			createAssignee({ id: "1", name: "alice" }),
			createAssignee({ id: "2", name: "bob" }),
			createAssignee({ id: "3", name: "charlie" }),
		];
		render(<AssigneeCell assignees={assignees} />);

		expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
	});
});
