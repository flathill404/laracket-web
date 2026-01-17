import { z } from "zod";
import { client } from "@/api/client";

import { ticketsSchema } from "./tickets";

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	description: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export type Project = z.infer<typeof projectSchema>;

const projectsSchema = z.array(projectSchema);

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

export const updateProject = async (projectId: string, name: string) => {
	const response = await client.put(`/projects/${projectId}`, { name });
	const json = await response.json();
	return projectSchema.parse(json.data);
};

export const fetchProjectTickets = async (projectId: string) => {
	const response = await client.get(`/projects/${projectId}/tickets`);
	const json = await response.json();
	return ticketsSchema.parse(json.data);
};
