import { z } from "zod";
import type { Project } from "@/features/projects/types";
import { projectSchema } from "@/features/projects/types/schemas";
import { client } from "@/lib/client";
import type { CreateOrganizationProjectInput } from "../types";

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
