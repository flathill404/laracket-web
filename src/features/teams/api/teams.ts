import { ticketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";
import {
	teamMemberSchema,
	teamMembersSchema,
	teamSchema,
	teamsSchema,
} from "../types/schemas";

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

export const updateTeam = async (
	teamId: string,
	data: { name: string; displayName: string },
) => {
	const response = await client.put(`/teams/${teamId}`, data);
	const json = await response.json();
	return teamSchema.parse(json.data);
};

export const deleteTeam = async (teamId: string) => {
	await client.delete(`/teams/${teamId}`);
};

/* Members */

export const fetchTeamMembers = async (teamId: string) => {
	const response = await client.get(`/teams/${teamId}/members`);
	const json = await response.json();
	return teamMembersSchema.parse(json.data);
};

export const addTeamMember = async (teamId: string, userId: string) => {
	const response = await client.post(`/teams/${teamId}/members`, { userId });
	const json = await response.json();
	return teamMemberSchema.parse(json.data);
};

export const updateTeamMember = async (
	teamId: string,
	userId: string,
	data: { role: "leader" | "member" },
) => {
	const response = await client.patch(
		`/teams/${teamId}/members/${userId}`,
		data,
	);
	const json = await response.json();
	return teamMemberSchema.parse(json.data);
};

export const removeTeamMember = async (teamId: string, userId: string) => {
	await client.delete(`/teams/${teamId}/members/${userId}`);
};
