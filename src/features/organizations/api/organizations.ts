import { z } from "zod";
import type { Project } from "@/features/projects/types";
import { projectSchema } from "@/features/projects/types/schemas";
import type { Team } from "@/features/teams/types";
import { teamSchema } from "@/features/teams/types/schemas";
import { client } from "@/lib/client";
import type {
	CreateOrganizationInput,
	CreateOrganizationProjectInput,
	CreateOrganizationTeamInput,
	OrganizationMemberInput,
	UpdateOrganizationInput,
	UpdateOrganizationMemberInput,
} from "../types";
import {
	organizationMemberSchema,
	organizationMembersSchema,
	organizationSchema,
	organizationsSchema,
} from "../types/schemas";

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

export const createOrganization = async (input: CreateOrganizationInput) => {
	const response = await client.post("/organizations", input);
	const json = await response.json();
	return organizationSchema.parse(json.data);
};

export const updateOrganization = async (
	organizationId: string,
	input: UpdateOrganizationInput,
) => {
	const response = await client.put(`/organizations/${organizationId}`, input);
	const json = await response.json();
	return organizationSchema.parse(json.data);
};

export const deleteOrganization = async (organizationId: string) => {
	await client.delete(`/organizations/${organizationId}`);
};

/* Members */

export const fetchOrganizationMembers = async (organizationId: string) => {
	const response = await client.get(`/organizations/${organizationId}/members`);
	const json = await response.json();
	return organizationMembersSchema.parse(json.data);
};

export const addOrganizationMember = async (
	organizationId: string,
	input: OrganizationMemberInput,
) => {
	const response = await client.post(
		`/organizations/${organizationId}/members`,
		input,
	);
	const json = await response.json();
	return organizationMemberSchema.parse(json.data);
};

export const updateOrganizationMember = async (
	organizationId: string,
	userId: string,
	input: UpdateOrganizationMemberInput,
) => {
	const response = await client.patch(
		`/organizations/${organizationId}/members/${userId}`,
		input,
	);
	const json = await response.json();
	return organizationMemberSchema.parse(json.data);
};

export const removeOrganizationMember = async (
	organizationId: string,
	userId: string,
) => {
	await client.delete(`/organizations/${organizationId}/members/${userId}`);
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

export const createOrganizationProject = async (
	organizationId: string,
	input: CreateOrganizationProjectInput,
) => {
	const response = await client.post(
		`/organizations/${organizationId}/projects`,
		input,
	);
	const json = await response.json();
	return projectSchema.parse(json.data);
};

const organizationTeamsSchema = z.array(teamSchema);

export const fetchOrganizationTeams = async (
	organizationId: string,
): Promise<Team[]> => {
	const response = await client.get(`/organizations/${organizationId}/teams`);
	const json = await response.json();
	return organizationTeamsSchema.parse(json.data);
};

export const createOrganizationTeam = async (
	organizationId: string,
	input: CreateOrganizationTeamInput,
) => {
	const response = await client.post(
		`/organizations/${organizationId}/teams`,
		input,
	);
	const json = await response.json();
	return teamSchema.parse(json.data);
};
