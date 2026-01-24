import { ticketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";
/**
 * Fetches the list of teams for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of teams.
 */
import type {
	CreateTeamInput,
	TeamMemberInput,
	UpdateTeamInput,
	UpdateTeamMemberInput,
} from "../types";
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

/* Members */

export const fetchTeamMembers = async (teamId: string) => {
	const response = await client.get(`/teams/${teamId}/members`);
	const json = await response.json();
	return teamMembersSchema.parse(json.data);
};

export const addTeamMember = async (teamId: string, input: TeamMemberInput) => {
	const response = await client.post(`/teams/${teamId}/members`, input);
	const json = await response.json();
	return teamMemberSchema.parse(json.data);
};

export const updateTeamMember = async (
	teamId: string,
	userId: string,
	input: UpdateTeamMemberInput,
) => {
	const response = await client.patch(
		`/teams/${teamId}/members/${userId}`,
		input,
	);
	const json = await response.json();
	return teamMemberSchema.parse(json.data);
};

export const removeTeamMember = async (teamId: string, userId: string) => {
	await client.delete(`/teams/${teamId}/members/${userId}`);
};
