import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { SuspenseSidebar } from "./SuspenseSidebar";

// Mock Sidebar to verify data passing
vi.mock("@/components/layout/Sidebar", () => ({
	Sidebar: ({
		projects,
		teams,
		organizations,
	}: {
		projects?: unknown[];
		teams?: unknown[];
		organizations?: unknown[];
	}) => (
		<div data-testid="sidebar">
			<div data-testid="project-count">{projects?.length || 0}</div>
			<div data-testid="team-count">{teams?.length || 0}</div>
			<div data-testid="org-count">{organizations?.length || 0}</div>
		</div>
	),
}));

// Mock Queries
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: (options: { queryKey: readonly unknown[] }) => {
			const key = options.queryKey;
			if (key.includes("projects")) {
				return { data: [{ id: "p1" }] };
			}
			if (key.includes("teams")) {
				return { data: [{ id: "t1" }, { id: "t2" }] };
			}
			if (key.includes("organizations")) {
				return { data: [{ id: "o1" }, { id: "o2" }, { id: "o3" }] };
			}
			return { data: [] };
		},
	};
});

// Mock query definitions
vi.mock("@/features/projects/utils/queries", () => ({
	projectQueries: {
		list: (userId: string) => ({ queryKey: ["projects", userId] }),
	},
}));
vi.mock("@/features/teams/utils/queries", () => ({
	teamQueries: {
		list: (userId: string) => ({ queryKey: ["teams", userId] }),
	},
}));
vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		list: () => ({ queryKey: ["organizations"] }),
	},
}));

describe("SuspenseSidebar", () => {
	it("fetches data and passes it to the Sidebar", () => {
		render(<SuspenseSidebar userId="user-1" />);

		expect(screen.getByTestId("sidebar")).toBeInTheDocument();
		expect(screen.getByTestId("project-count")).toHaveTextContent("1"); // 1 project
		expect(screen.getByTestId("team-count")).toHaveTextContent("2"); // 2 teams
		expect(screen.getByTestId("org-count")).toHaveTextContent("3"); // 3 orgs
	});
});
