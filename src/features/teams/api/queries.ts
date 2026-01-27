import { queryOptions } from "@tanstack/react-query";
import { fetchTeam, fetchTeamMembers, fetchTeamTickets } from "./teams";

export const teamQueries = {
	detail: (teamId: string) =>
		queryOptions({
			queryKey: ["teams", teamId],
			queryFn: () => fetchTeam(teamId),
		}),

	members: (teamId: string) =>
		queryOptions({
			queryKey: ["teams", teamId, "members"],
			queryFn: () => fetchTeamMembers(teamId),
		}),

	tickets: (teamId: string) =>
		queryOptions({
			queryKey: ["teams", teamId, "tickets"],
			queryFn: () => fetchTeamTickets(teamId),
		}),
};
