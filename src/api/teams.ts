import { z } from "zod";
import { client } from "@/api/client";

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
