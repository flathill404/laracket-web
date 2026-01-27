import { client } from "@/lib/client";
import type { TeamMemberInput, UpdateTeamMemberInput } from "../types";
import { teamMemberSchema, teamMembersSchema } from "../types/schemas";

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
