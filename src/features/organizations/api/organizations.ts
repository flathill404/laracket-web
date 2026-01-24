import { z } from "zod";
import { type Project, projectSchema } from "@/features/projects/api/projects";
import { type Team, teamSchema } from "@/features/teams/api/teams";
import { type Assignee, assigneeSchema } from "@/features/tickets/api/tickets";
import { client } from "@/lib/client";

export const organizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export type Organization = z.infer<typeof organizationSchema>;

const organizationsSchema = z.array(organizationSchema);

/**
 * Fetches the list of organizations for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of organizations.
 */
export const fetchOrganizations = async (userId: string) => {
	const response = await client.get(`/users/${userId}/organizations`);
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
