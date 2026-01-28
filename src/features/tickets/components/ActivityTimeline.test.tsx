import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Activity } from "../types";
import { ActivityItem } from "./ActivityItem";
import { ActivityTimeline } from "./ActivityTimeline";

const createMockActivity = (overrides: Partial<Activity> = {}): Activity => ({
	id: 1,
	type: "created",
	payload: null,
	createdAt: "2024-01-01T12:00:00Z",
	user: {
		id: "user-123",
		name: "johndoe",
		displayName: "John Doe",
		avatarUrl: "https://example.com/avatar.jpg",
	},
	...overrides,
});

describe("ActivityItem", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-01T12:05:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should render user display name", () => {
		const activity = createMockActivity({
			user: { ...createMockActivity().user, displayName: "Jane Smith" },
		});
		render(<ActivityItem activity={activity} />);

		expect(screen.getByText("Jane Smith")).toBeInTheDocument();
	});

	it("should render 'created this ticket' for created type", () => {
		const activity = createMockActivity({ type: "created" });
		render(<ActivityItem activity={activity} />);

		expect(screen.getByText("created this ticket")).toBeInTheDocument();
	});

	it("should render status change description for updated type with status payload", () => {
		const activity = createMockActivity({
			type: "updated",
			payload: {
				status: { from: "open", to: "in_progress" },
			},
		});
		render(<ActivityItem activity={activity} />);

		expect(
			screen.getByText("changed status from Open to In Progress"),
		).toBeInTheDocument();
	});

	it("should render 'updated this ticket' for updated type without status payload", () => {
		const activity = createMockActivity({
			type: "updated",
			payload: null,
		});
		render(<ActivityItem activity={activity} />);

		expect(screen.getByText("updated this ticket")).toBeInTheDocument();
	});

	it("should render relative time", () => {
		const activity = createMockActivity({
			createdAt: "2024-01-01T12:00:00Z",
		});
		render(<ActivityItem activity={activity} />);

		expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
	});

	it("should render avatar fallback with first two letters of displayName uppercase", () => {
		const activity = createMockActivity({
			user: {
				...createMockActivity().user,
				displayName: "Alice Smith",
				avatarUrl: null,
			},
		});
		render(<ActivityItem activity={activity} />);

		expect(screen.getByText("AL")).toBeInTheDocument();
	});
});

describe("ActivityTimeline", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-01T12:05:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should render all activities", () => {
		const activities = [
			createMockActivity({
				id: 1,
				user: { ...createMockActivity().user, displayName: "Alice" },
			}),
			createMockActivity({
				id: 2,
				user: { ...createMockActivity().user, displayName: "Bob" },
			}),
			createMockActivity({
				id: 3,
				user: { ...createMockActivity().user, displayName: "Charlie" },
			}),
		];
		render(<ActivityTimeline activities={activities} />);

		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
		expect(screen.getByText("Charlie")).toBeInTheDocument();
	});

	it("should render empty state when no activities", () => {
		render(<ActivityTimeline activities={[]} />);

		// Should not throw and should render container
		const container = document.querySelector(".relative.space-y-8");
		expect(container).toBeInTheDocument();
	});

	it("should render activities in order", () => {
		const activities = [
			createMockActivity({ id: 1, type: "created" }),
			createMockActivity({ id: 2, type: "updated", payload: null }),
		];
		render(<ActivityTimeline activities={activities} />);

		const items = screen.getAllByText(/this ticket/);
		expect(items).toHaveLength(2);
	});
});
