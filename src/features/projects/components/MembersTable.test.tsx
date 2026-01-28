import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MembersTable } from "./MembersTable";

describe("MembersTable", () => {
	const mockData = [
		{ id: "1", name: "user1", displayName: "User One", avatarUrl: null },
		{ id: "2", name: "user2", displayName: "User Two", avatarUrl: null },
	];

	it("renders table headers", () => {
		render(<MembersTable data={[]} />);
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Role")).toBeInTheDocument();
		expect(screen.getByText("Assignment")).toBeInTheDocument();
	});

	it("renders data rows", () => {
		render(<MembersTable data={mockData} />);
		expect(screen.getByText("User One")).toBeInTheDocument();
		expect(screen.getByText("User Two")).toBeInTheDocument();
		expect(screen.getByText("2 member(s)")).toBeInTheDocument();
	});

	it("renders empty state", () => {
		render(<MembersTable data={[]} />);
		expect(screen.getByText("No members found.")).toBeInTheDocument();
		expect(screen.getByText("0 member(s)")).toBeInTheDocument();
	});
});
