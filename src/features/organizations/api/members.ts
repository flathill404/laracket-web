import { client } from "@/lib/client";
import type {
	OrganizationMemberInput,
	UpdateOrganizationMemberInput,
} from "../types";
import {
	organizationMemberSchema,
	organizationMembersSchema,
} from "../types/schemas";

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
