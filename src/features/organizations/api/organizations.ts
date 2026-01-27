import { client } from "@/lib/client";
import type {
	CreateOrganizationInput,
	UpdateOrganizationInput,
} from "../types";
import { organizationSchema, organizationsSchema } from "../types/schemas";

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
