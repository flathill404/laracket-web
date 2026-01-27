import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTeam, fetchTeamMembers, fetchTeams } from "../api";
import { teamQueries } from "./queries";

vi.mock("../api", () => ({
	fetchTeams: vi.fn(),
	fetchTeam: vi.fn(),
	fetchTeamMembers: vi.fn(),
}));

describe("teams queries", () => {
	it("list", async () => {
		const userId = "user-1";
		const options = teamQueries.list(userId);
		expect(options.queryKey).toEqual(queryKeys.teams.list(userId));
		// @ts-expect-error
		await options.queryFn();
		expect(fetchTeams).toHaveBeenCalledWith(userId);
	});

	it("detail", async () => {
		const teamId = "team-1";
		const options = teamQueries.detail(teamId);
		expect(options.queryKey).toEqual(queryKeys.teams.detail(teamId));
		// @ts-expect-error
		await options.queryFn();
		expect(fetchTeam).toHaveBeenCalledWith(teamId);
	});

	it("members", async () => {
		const teamId = "team-1";
		const options = teamQueries.members(teamId);
		expect(options.queryKey).toEqual(queryKeys.teams.members(teamId));
		// @ts-expect-error
		await options.queryFn();
		expect(fetchTeamMembers).toHaveBeenCalledWith(teamId);
	});
});
