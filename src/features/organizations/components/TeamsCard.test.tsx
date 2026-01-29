import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { TeamsCard } from "./TeamsCard";

// Mock queries
vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		teams: (id: string) => ({
			queryKey: ["organizations", id, "teams"],
		}),
	},
}));

// Mock useSuspenseQuery
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: (options: { queryKey: readonly unknown[] }) => {
			if (options.queryKey.includes("teams")) {
				return {
					data: [
						{ id: "1", name: "Team 1" },
						{ id: "2", name: "Team 2" },
						{ id: "3", name: "Team 3" },
					],
				};
			}
			return { data: [] };
		},
	};
});

describe("TeamsCard", () => {
	it("renders team count", () => {
		render(<TeamsCard organizationId="org-1" />);

		expect(screen.getByText("Teams")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
		expect(screen.getByText("Teams in this organization")).toBeInTheDocument();
	});
});
