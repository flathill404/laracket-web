import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import { fetchTeams } from "../api/teams";
import { teamsQueryOptions } from "./queries";

vi.mock("../api/teams", () => ({
	fetchTeams: vi.fn(),
}));

describe("teams queries", () => {
	it("teamsQueryOptions", async () => {
		const userId = "user-1";
		const options = teamsQueryOptions(userId);
		expect(options.queryKey).toEqual(queryKeys.teams.list(userId));
		// @ts-expect-error
		await options.queryFn();
		expect(fetchTeams).toHaveBeenCalledWith(userId);
	});
});
