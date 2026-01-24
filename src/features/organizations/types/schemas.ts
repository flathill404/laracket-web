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
