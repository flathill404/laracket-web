import { client } from "@/lib/client";
import type { CreateProjectInput, UpdateProjectInput } from "../types";
import { projectSchema, projectsSchema } from "../types/schemas";

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

export const createProject = async (input: CreateProjectInput) => {
	const response = await client.post("/projects", input);
	const json = await response.json();
	return projectSchema.parse(json.data);
};

export const deleteProject = async (projectId: string) => {
	await client.delete(`/projects/${projectId}`);
};
