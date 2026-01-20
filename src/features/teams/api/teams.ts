import { z } from "zod";
import { client } from "@/api/client";
import { ticketsSchema } from "@/features/tickets/api/tickets";

export const teamSchema = z.object({
	id: z.string(),
	name: z.string(),
	// Add other fields as needed
});

export type Team = z.infer<typeof teamSchema>;

const teamsSchema = z.array(teamSchema);

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
