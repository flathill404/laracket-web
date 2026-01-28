import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { MembersCard } from "./MembersCard";

// Mock queries
vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		members: (id: string) => ({
			queryKey: ["organizations", "members", id],
			queryFn: () => [
				{ id: "1", name: "User 1" },
				{ id: "2", name: "User 2" },
			],
		}),
	},
}));

describe("MembersCard", () => {
	it("should render members count", async () => {
		render(
			<Suspense fallback={<div>Loading...</div>}>
				<MembersCard organizationId="org-1" />
			</Suspense>,
		);

		expect(await screen.findByText("Members")).toBeInTheDocument();
		expect(screen.getByText("2")).toBeInTheDocument();
		expect(
			screen.getByText("Active members in this organization"),
		).toBeInTheDocument();
	});
});
