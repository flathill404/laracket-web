import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { CreateTicketDrawerSkeleton } from "./CreateTicketDrawerSkeleton";

describe("CreateTicketDrawerSkeleton", () => {
	it("renders skeleton structure", () => {
		const { container } = render(<CreateTicketDrawerSkeleton />);
		// Check for skeleton elements
		expect(container.querySelectorAll(".animate-pulse")).not.toHaveLength(0);
	});

	it("renders header section", () => {
		const { container } = render(<CreateTicketDrawerSkeleton />);
		// Check for header with border-b class
		const header = container.querySelector(".border-b");
		expect(header).toBeInTheDocument();
	});

	it("renders main form area", () => {
		const { container } = render(<CreateTicketDrawerSkeleton />);
		// Check for main content area (65% width)
		const mainArea = container.querySelector(".w-\\[65\\%\\]");
		expect(mainArea).toBeInTheDocument();
	});

	it("renders sidebar area", () => {
		const { container } = render(<CreateTicketDrawerSkeleton />);
		// Check for sidebar (35% width with border-l)
		const sidebar = container.querySelector(".w-\\[35\\%\\]");
		expect(sidebar).toBeInTheDocument();
		expect(sidebar).toHaveClass("border-l");
	});
});
