import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
	fetchTeam,
	fetchTeamMembers,
	fetchTeams,
	fetchTeamTickets,
} from "../api";

export const teamQueries = {
	list: (userId: string) =>
		queryOptions({
			queryKey: queryKeys.teams.list(userId),
			queryFn: () => fetchTeams(userId),
			enabled: !!userId,
		}),

	detail: (teamId: string) =>
		queryOptions({
			queryKey: queryKeys.teams.detail(teamId),
			queryFn: () => fetchTeam(teamId),
			enabled: !!teamId,
		}),

	members: (teamId: string) =>
		queryOptions({
			queryKey: queryKeys.teams.members(teamId),
			queryFn: () => fetchTeamMembers(teamId),
			enabled: !!teamId,
		}),

	tickets: (teamId: string) =>
		queryOptions({
			queryKey: queryKeys.teams.tickets(teamId),
			queryFn: () => fetchTeamTickets(teamId),
			enabled: !!teamId,
		}),
};
