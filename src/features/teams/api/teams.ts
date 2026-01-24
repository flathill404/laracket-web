import { ticketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";
import { teamSchema, teamsSchema } from "../types/schemas";

export type { Team } from "../types";

/**
 * Fetches the list of teams for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of teams.
 */
export const fetchTeams = async (userId: string) => {
	const response = await client.get(`/users/${userId}/teams`);
	const json = await response.json();
	return teamsSchema.parse(json.data);
};

export const fetchTeam = async (teamId: string) => {
	const response = await client.get(`/teams/${teamId}`);
	const json = await response.json();
	return teamSchema.parse(json.data);
};

export const fetchTeamTickets = async (teamId: string) => {
	const response = await client.get(`/teams/${teamId}/tickets`);
	const json = await response.json();
	return ticketsSchema.parse(json.data);
};

export const createTeam = async (data: {
	name: string;
	displayName: string;
}) => {
	const response = await client.post("/teams", data);
	const json = await response.json();
	return teamSchema.parse(json.data);
};
