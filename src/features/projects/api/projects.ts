import { paginatedTicketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";
import type {
	CreateProjectInput,
	ProjectMemberInput,
	ProjectTeamInput,
	UpdateProjectInput,
} from "../types";
import {
	projectMemberSchema,
	projectMembersSchema,
	projectSchema,
	projectsSchema,
} from "../types/schemas";

/**
 * Fetches the list of projects for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of projects.
 */
export const fetchProjects = async (userId: string) => {
	const response = await client.get(`/users/${userId}/projects`);
	const json = await response.json();
	return projectsSchema.parse(json.data);
};

export const fetchProject = async (projectId: string) => {
	const response = await client.get(`/projects/${projectId}`);
	const json = await response.json();
	return projectSchema.parse(json.data);
};

export const updateProject = async (
	projectId: string,
	input: UpdateProjectInput,
) => {
	const response = await client.put(`/projects/${projectId}`, input);
	const json = await response.json();
	return projectSchema.parse(json.data);
};

export const fetchProjectTickets = async (
	projectId: string,
	filters?: { status?: string[]; sort?: string; cursor?: string },
) => {
	const searchParams = new URLSearchParams();
	if (filters?.status) {
		for (const s of filters.status) {
			searchParams.append("status[]", s);
		}
	}
	if (filters?.sort) {
		searchParams.append("sort", filters.sort);
	}
	if (filters?.cursor) {
		searchParams.append("cursor", filters.cursor);
	}
	const queryString = searchParams.toString();
	const url = `/projects/${projectId}/tickets${queryString ? `?${queryString}` : ""}`;

	const response = await client.get(url);
	const json = await response.json();
	return paginatedTicketsSchema.parse(json);
};

export const fetchProjectMembers = async (projectId: string) => {
	const response = await client.get(`/projects/${projectId}/members`);
	const json = await response.json();
	return projectMembersSchema.parse(json.data);
};

export const createProject = async (input: CreateProjectInput) => {
	const response = await client.post("/projects", input);
	const json = await response.json();
	return projectSchema.parse(json.data);
};

export const deleteProject = async (projectId: string) => {
	await client.delete(`/projects/${projectId}`);
};

/* Members */

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

/* Teams */

export const addProjectTeam = async (
	projectId: string,
	input: ProjectTeamInput,
) => {
	// Assuming response returns updated project or simple success. Standard pattern usually returns created resource.
	// But adding team to project might return the pivot or nothing.
	// Based on other APIs, assume it works. If it returns something specific I might need schema.
	// For now, let's assume void or simple success.
	// Actually typical Laravel many-to-many attach returns nothing or array of attached IDs.
	// Let's assume standard client call for now.
	await client.post(`/projects/${projectId}/teams`, input);
};

export const removeProjectTeam = async (projectId: string, teamId: string) => {
	await client.delete(`/projects/${projectId}/teams/${teamId}`);
};
