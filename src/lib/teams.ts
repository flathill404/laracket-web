import { queryOptions } from "@tanstack/react-query";
import { fetchTeams } from "../api/teams";

export const teamsQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["teams", userId],
		queryFn: async () => {
			return await fetchTeams(userId);
		},
	});
