import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
	it("renders the dashboard header", () => {
		render(<Dashboard />);
		expect(
			screen.getByRole("heading", { name: "Dashboard" }),
		).toBeInTheDocument();
	});

	it("renders statistics cards", () => {
		render(<Dashboard />);
		expect(screen.getByText("Total Tickets")).toBeInTheDocument();
		expect(screen.getByText("142")).toBeInTheDocument();
	});

	it("renders widget placeholders", () => {
		render(<Dashboard />);
		expect(screen.getByText("Widget Area (Chart)")).toBeInTheDocument();
		expect(
			screen.getByText("Widget Area (Recent Activity)"),
		).toBeInTheDocument();
	});
});
