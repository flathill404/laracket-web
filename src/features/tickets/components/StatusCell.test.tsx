import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatusCell } from "./StatusCell";

describe("StatusCell", () => {
	it("should render open status with correct label", () => {
		render(<StatusCell status="open" />);

		expect(screen.getByText("Open")).toBeInTheDocument();
	});

	it("should render in_progress status with correct label", () => {
		render(<StatusCell status="in_progress" />);

		expect(screen.getByText("In Progress")).toBeInTheDocument();
	});

	it("should render in_review status with correct label", () => {
		render(<StatusCell status="in_review" />);

		expect(screen.getByText("In Review")).toBeInTheDocument();
	});

	it("should render resolved status with correct label", () => {
		render(<StatusCell status="resolved" />);

		expect(screen.getByText("Resolved")).toBeInTheDocument();
	});

	it("should render closed status with correct label", () => {
		render(<StatusCell status="closed" />);

		expect(screen.getByText("Closed")).toBeInTheDocument();
	});

	it("should render unknown status in title case", () => {
		const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(<StatusCell status="custom_status" />);

		expect(screen.getByText("Custom Status")).toBeInTheDocument();
		consoleSpy.mockRestore();
	});

	it("should render circle icon", () => {
		render(<StatusCell status="open" />);

		const icon = document.querySelector("svg");
		expect(icon).toBeInTheDocument();
	});
});
