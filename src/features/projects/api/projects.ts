import { z } from "zod";
import {
	type Assignee,
	assigneeSchema,
	paginatedTicketsSchema,
} from "@/features/tickets/api/tickets";
import { client } from "@/lib/client";
import { projectSchema, projectsSchema } from "../types/schemas";

export type { Project } from "../types";
// Re-export schema and type for backwards compatibility
export { projectSchema } from "../types/schemas";

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
	data: { name: string; description: string },
) => {
	const response = await client.put(`/projects/${projectId}`, data);
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

const projectMembersSchema = z.array(assigneeSchema);

export const fetchProjectMembers = async (
	projectId: string,
): Promise<Assignee[]> => {
	const response = await client.get(`/projects/${projectId}/members`);
	const json = await response.json();
	return projectMembersSchema.parse(json.data);
};

export const createProject = async (data: {
	name: string;
	description: string;
}) => {
	const response = await client.post("/projects", data);
	const json = await response.json();
	return projectSchema.parse(json.data);
};
