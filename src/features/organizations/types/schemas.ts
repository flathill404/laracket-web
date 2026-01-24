import { z } from "zod";

export const organizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export const organizationsSchema = z.array(organizationSchema);

export const organizationMemberSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
	role: z.enum(["owner", "admin", "member"]).optional(),
});

export const organizationMembersSchema = z.array(organizationMemberSchema);

/* Inputs */

export const createOrganizationInputSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
});

export const updateOrganizationInputSchema = createOrganizationInputSchema;

export const organizationMemberInputSchema = z.object({
	userId: z.string(),
});

export const updateOrganizationMemberInputSchema = z.object({
	role: z.enum(["owner", "admin", "member"]),
});

export const createOrganizationProjectInputSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
});

export const createOrganizationTeamInputSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
});
