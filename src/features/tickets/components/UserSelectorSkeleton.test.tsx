import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { UserSelectorSkeleton } from "./UserSelectorSkeleton";

describe("UserSelectorSkeleton", () => {
	it("renders with label", () => {
		render(<UserSelectorSkeleton label="Assignees" />);
		expect(screen.getByText("Assignees")).toBeInTheDocument();
	});

	it("renders skeleton structure", () => {
		const { container } = render(<UserSelectorSkeleton label="Test" />);
		// Check for skeleton elements
		expect(container.querySelectorAll(".animate-pulse")).not.toHaveLength(0);
	});
});
