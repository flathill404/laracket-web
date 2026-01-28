import { z } from "zod";

export const teamSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export const teamsSchema = z.array(teamSchema);

export const teamMemberSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
	role: z.enum(["leader", "member"]).optional(), // Assuming role exists based on user rules
});

export const teamMembersSchema = z.array(teamMemberSchema);

/* Inputs */

export const createTeamInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Name can only contain letters, numbers, dashes, and underscores",
		),
	displayName: z.string().min(1),
});

export const updateTeamInputSchema = createTeamInputSchema;

export const teamMemberInputSchema = z.object({
	userId: z.string(),
});

export const updateTeamMemberInputSchema = z.object({
	role: z.enum(["leader", "member"]),
});
