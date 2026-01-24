import { z } from "zod";
import type { Project } from "@/features/projects/types";
import { projectSchema } from "@/features/projects/types/schemas";
import type { Team } from "@/features/teams/types";
import { teamSchema } from "@/features/teams/types/schemas";
import type { Assignee } from "@/features/tickets/types";
import { ticketUserSchema as assigneeSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";
import { organizationSchema, organizationsSchema } from "../types/schemas";

export type { Organization } from "../types";

/**
 * Fetches the list of organizations for the logged-in user.
 * @returns An array of organizations.
 */
export const fetchOrganizations = async () => {
	const response = await client.get("/organizations");
	const json = await response.json();
	return organizationsSchema.parse(json.data);
};

export const fetchOrganization = async (organizationId: string) => {
	const response = await client.get(`/organizations/${organizationId}`);
	const json = await response.json();
	return organizationSchema.parse(json.data);
};

export const createOrganization = async (data: {
	name: string;
	displayName: string;
}) => {
	const response = await client.post("/organizations", data);
	const json = await response.json();
	return organizationSchema.parse(json.data);
};

export const updateOrganization = async (
	organizationId: string,
	data: { name: string; displayName: string },
) => {
	const response = await client.put(`/organizations/${organizationId}`, data);
	const json = await response.json();
	return organizationSchema.parse(json.data);
};

const organizationMembersSchema = z.array(assigneeSchema);

export const fetchOrganizationMembers = async (
	organizationId: string,
): Promise<Assignee[]> => {
	const response = await client.get(`/organizations/${organizationId}/members`);
	const json = await response.json();
	return organizationMembersSchema.parse(json.data);
};

const organizationProjectsSchema = z.array(projectSchema);

export const fetchOrganizationProjects = async (
	organizationId: string,
): Promise<Project[]> => {
	const response = await client.get(
		`/organizations/${organizationId}/projects`,
	);
	const json = await response.json();
	return organizationProjectsSchema.parse(json.data);
};

const organizationTeamsSchema = z.array(teamSchema);

export const fetchOrganizationTeams = async (
	organizationId: string,
): Promise<Team[]> => {
	const response = await client.get(`/organizations/${organizationId}/teams`);
	const json = await response.json();
	return organizationTeamsSchema.parse(json.data);
};
