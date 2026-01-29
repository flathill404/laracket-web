import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { ProjectsCard } from "./ProjectsCard";

// Mock queries
vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		projects: (id: string) => ({
			queryKey: ["organizations", id, "projects"],
		}),
	},
}));

// Mock useSuspenseQuery
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: (options: { queryKey: readonly unknown[] }) => {
			if (options.queryKey.includes("projects")) {
				return {
					data: [
						{ id: "1", name: "Project 1" },
						{ id: "2", name: "Project 2" },
					],
				};
			}
			return { data: [] };
		},
	};
});

describe("ProjectsCard", () => {
	it("renders project count", () => {
		render(<ProjectsCard organizationId="org-1" />);

		expect(screen.getByText("Projects")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument(); // Count
		expect(
			screen.getByText("Projects in this organization"),
		).toBeInTheDocument();
	});
});
