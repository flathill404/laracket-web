import { client } from "@/lib/client";
import type { ProjectMemberInput } from "../types";
import { projectMemberSchema, projectMembersSchema } from "../types/schemas";

export const fetchProjectMembers = async (projectId: string) => {
	const response = await client.get(`/projects/${projectId}/members`);
	const json = await response.json();
	return projectMembersSchema.parse(json.data);
};

export const addProjectMember = async (
	projectId: string,
	input: ProjectMemberInput,
) => {
	const response = await client.post(`/projects/${projectId}/members`, input);
	const json = await response.json();
	return projectMemberSchema.parse(json.data);
};

export const removeProjectMember = async (
	projectId: string,
	userId: string,
) => {
	await client.delete(`/projects/${projectId}/members/${userId}`);
};
