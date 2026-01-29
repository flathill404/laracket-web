import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Organization } from "@/features/organizations/types";
import type { Project } from "@/features/projects/types";
import type { Team } from "@/features/teams/types";
import { render } from "@/test/utils";
import { Sidebar } from "./Sidebar";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		className,
		...props
	}: {
		children: ReactNode;
		className?: string;
		[key: string]: unknown;
	}) => (
		<a className={className} data-testid="link" {...props}>
			{children}
		</a>
	),
	useRouter: () => ({
		state: { location: { pathname: "/" } },
	}),
}));

vi.mock("@/hooks/useRouteAwareAccordion", () => ({
	useRouteAwareAccordion: () => [
		["projects", "teams", "organizations"],
		vi.fn(),
	],
}));

// Mock Dialogs to avoid complex rendering
vi.mock("@/features/projects/components/CreateProjectDialog", () => ({
	CreateProjectDialog: ({ open }: { open: boolean }) =>
		open ? (
			<div data-testid="create-project-dialog">Create Project Dialog</div>
		) : null,
}));
vi.mock("@/features/teams/components/CreateTeamDialog", () => ({
	CreateTeamDialog: ({ open }: { open: boolean }) =>
		open ? (
			<div data-testid="create-team-dialog">Create Team Dialog</div>
		) : null,
}));
vi.mock("@/features/organizations/components/CreateOrganizationDialog", () => ({
	CreateOrganizationDialog: ({ open }: { open: boolean }) =>
		open ? (
			<div data-testid="create-org-dialog">Create Organization Dialog</div>
		) : null,
}));

describe("Sidebar", () => {
	const mockProjects: Project[] = [{ id: "p1", name: "Project 1" } as Project];
	const mockTeams: Team[] = [{ id: "t1", displayName: "Team 1" } as Team];
	const mockOrgs: Organization[] = [
		{ id: "o1", displayName: "Org 1" } as Organization,
	];

	it("renders navigation links", () => {
		render(
			<Sidebar
				projects={mockProjects}
				teams={mockTeams}
				organizations={mockOrgs}
			/>,
		);

		expect(screen.getByText("Dashboard")).toBeInTheDocument();
		expect(screen.getByText("My Work")).toBeInTheDocument();
		expect(screen.getByText("All Tickets")).toBeInTheDocument();
		expect(screen.getByText("Settings")).toBeInTheDocument();
	});

	it("renders projects", () => {
		render(
			<Sidebar
				projects={mockProjects}
				teams={mockTeams}
				organizations={mockOrgs}
			/>,
		);
		expect(screen.getByText("Project 1")).toBeInTheDocument();
	});

	it("renders teams", () => {
		render(
			<Sidebar
				projects={mockProjects}
				teams={mockTeams}
				organizations={mockOrgs}
			/>,
		);
		expect(screen.getByText("Team 1")).toBeInTheDocument();
	});

	it("renders organizations", () => {
		render(
			<Sidebar
				projects={mockProjects}
				teams={mockTeams}
				organizations={mockOrgs}
			/>,
		);
		expect(screen.getByText("Org 1")).toBeInTheDocument();
	});

	it("opens create project dialog", async () => {
		const user = userEvent.setup();
		render(
			<Sidebar
				projects={mockProjects}
				teams={mockTeams}
				organizations={mockOrgs}
			/>,
		);

		// Find the add button for Projects section.
		// Since we mocked the dialogs, we can check for their appearance.
		// We need to reliably target the add button.
		// The projects section is the first one.
		const addButtons = screen.getAllByRole("button");
		// Accordion triggers are also buttons.
		// SidebarSection uses a button with Plus icon.
		// Let's assume the first "Add" like button in the DOM that is not an accordion trigger (text content check).
		// Actually, in SidebarSection test we used: buttons.find(btn => !btn.textContent.includes(Title))

		// Button for Projects
		// The Accordion structure: Project Trigger, Add Button, Project Content...
		// But here we have multiple sections.
		// Let's look for the one near "Projects".
		// Or simpler: getAllByRole("button") that contains SVG but no text?

		// Let's assume the add buttons are the ones without text content in this context (since triggers have text).
		const iconButtons = addButtons.filter((b) => !b.textContent);
		const addProjectBtn = iconButtons[0];

		await user.click(addProjectBtn);
		expect(screen.getByTestId("create-project-dialog")).toBeInTheDocument();
	});
});
