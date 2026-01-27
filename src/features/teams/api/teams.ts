import { client } from "@/lib/client";
/**
 * Fetches the list of teams for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of teams.
 */
import type { CreateTeamInput, UpdateTeamInput } from "../types";
import { teamSchema, teamsSchema } from "../types/schemas";

export const createTeam = async (input: CreateTeamInput) => {
	const response = await client.post("/teams", input);
	const json = await response.json();
	return teamSchema.parse(json.data);
};

export const updateTeam = async (teamId: string, input: UpdateTeamInput) => {
	const response = await client.put(`/teams/${teamId}`, input);
	const json = await response.json();
	return teamSchema.parse(json.data);
};

export const deleteTeam = async (teamId: string) => {
	await client.delete(`/teams/${teamId}`);
};

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
