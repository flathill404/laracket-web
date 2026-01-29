import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatusCell } from "./StatusCell";

describe("StatusCell", () => {
	it("renders the open status with correct label", () => {
		render(<StatusCell status="open" />);

		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("renders the in_progress status with correct label", () => {
		render(<StatusCell status="in_progress" />);

		expect(screen.getByText("In Progress")).toBeInTheDocument();
	});

	it("renders the in_review status with correct label", () => {
		render(<StatusCell status="in_review" />);

		expect(screen.getByText("In Review")).toBeInTheDocument();
	});

	it("renders the resolved status with correct label", () => {
		render(<StatusCell status="resolved" />);

		expect(screen.getByText("Resolved")).toBeInTheDocument();
	});

	it("renders the closed status with correct label", () => {
		render(<StatusCell status="closed" />);

		expect(screen.getByText("Closed")).toBeInTheDocument();
	});

	it("renders an unknown status in title case", () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<StatusCell status="custom_status" />);

		expect(screen.getByText("Custom Status")).toBeInTheDocument();
		consoleSpy.mockRestore();
	});

	it("renders the circle icon", () => {
		render(<StatusCell status="open" />);

		const icon = document.querySelector("svg");
		expect(icon).toBeInTheDocument();
	});
});
