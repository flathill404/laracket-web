import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/features/projects/types";
import { render } from "@/test/utils";
import { ProjectsList } from "./ProjectsList";

// Mock Link
vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		className,
		onClick,
		...props
	}: {
		children: React.ReactNode;
		className?: string;
		onClick?: () => void;
		[key: string]: unknown;
	}) => (
		<button
			type="button"
			className={className}
			data-testid="link"
			onClick={(e) => {
				e.preventDefault();
				onClick?.();
			}}
			{...props}
		>
			{children}
		</button>
	),
}));

describe("ProjectsList", () => {
	const mockProjects: Project[] = [
		{
			id: "1",
			name: "project-1",
			displayName: "Project 1",
			description: "Desc 1",
		} as Project,
		{
			id: "2",
			name: "project-2",
			displayName: "Project 2",
			description: "Desc 2",
		} as Project,
	];

	it("renders list of projects", () => {
		render(<ProjectsList projects={mockProjects} onProjectClick={vi.fn()} />);

		expect(screen.getByText("Project 1")).toBeInTheDocument();
		expect(screen.getByText("Desc 1")).toBeInTheDocument();
		expect(screen.getByText("Project 2")).toBeInTheDocument();
		expect(screen.getByText("Desc 2")).toBeInTheDocument();
	});

	it("renders empty state when no projects", () => {
		render(<ProjectsList projects={[]} onProjectClick={vi.fn()} />);

		expect(screen.getByText("No projects yet")).toBeInTheDocument();
		expect(
			screen.getByText("Create your first project to get started."),
		).toBeInTheDocument();
	});

	it("calls onProjectClick when card is clicked", async () => {
		const handleProjectClick = vi.fn();
		const user = userEvent.setup();
		render(
			<ProjectsList
				projects={[mockProjects[0]]}
				onProjectClick={handleProjectClick}
			/>,
		);

		// Click the card (check if Card title is clickable or the specific area)
		// The Card has onClick
		await user.click(screen.getByText("Project 1"));

		expect(handleProjectClick).toHaveBeenCalledWith(mockProjects[0]);
	});
});
