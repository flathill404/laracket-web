import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
	it("should render dashboard header", () => {
		render(<Dashboard />);
		expect(
			screen.getByRole("heading", { name: "Dashboard" }),
		).toBeInTheDocument();
	});

	it("should render statistics cards", () => {
		render(<Dashboard />);
		expect(screen.getByText("Total Tickets")).toBeInTheDocument();
		expect(screen.getByText("142")).toBeInTheDocument();
	});

	it("should render widget placeholders", () => {
		render(<Dashboard />);
		expect(screen.getByText("Widget Area (Chart)")).toBeInTheDocument();
		expect(
			screen.getByText("Widget Area (Recent Activity)"),
		).toBeInTheDocument();
	});
});
