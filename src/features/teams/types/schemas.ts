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
