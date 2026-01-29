import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import type { Activity } from "../types";
import { ActivityItem } from "./ActivityItem";

// Mock date formatting
vi.mock("@/lib/date", () => ({
	formatRelativeTime: vi.fn((_date: string) => "2 hours ago"),
}));

describe("ActivityItem", () => {
	const mockUser = {
		id: "u1",
		name: "user1",
		displayName: "John Doe",
		avatarUrl: null,
	};

	it("renders created activity", () => {
		const activity: Activity = {
			id: 1,
			type: "created",
			payload: null,
			createdAt: "2024-01-28T10:00:00Z",
			user: mockUser,
		};

		render(<ActivityItem activity={activity} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("created this ticket")).toBeInTheDocument();
		expect(screen.getByText("2 hours ago")).toBeInTheDocument();
	});

	it("renders status change activity", () => {
		const activity: Activity = {
			id: 2,
			type: "updated",
			payload: {
				status: {
					from: "open",
					to: "in_progress",
				},
			},
			createdAt: "2024-01-28T10:00:00Z",
			user: mockUser,
		};

		render(<ActivityItem activity={activity} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		// Check for status change text
		const description = screen.getByText(/changed status from/);
		expect(description).toBeInTheDocument();
	});

	it("renders generic update activity", () => {
		const activity: Activity = {
			id: 3,
			type: "updated",
			payload: { someField: "value" },
			createdAt: "2024-01-28T10:00:00Z",
			user: mockUser,
		};

		render(<ActivityItem activity={activity} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("updated this ticket")).toBeInTheDocument();
	});

	it("renders user avatar", () => {
		const activity: Activity = {
			id: 1,
			type: "created",
			payload: null,
			createdAt: "2024-01-28T10:00:00Z",
			user: mockUser,
		};

		const { container } = render(<ActivityItem activity={activity} />);
		// Check for avatar with absolute positioning
		const avatar = container.querySelector(".absolute");
		expect(avatar).toBeInTheDocument();
	});
});
