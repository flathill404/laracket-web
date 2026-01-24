import { queryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchTeams } from "../api/teams";

export const teamsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: queryKeys.teams.list(userId),
		queryFn: async () => {
			return await fetchTeams(userId);
		},
	});
