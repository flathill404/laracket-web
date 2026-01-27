import { z } from "zod";

import { ticketUserSchema } from "@/features/tickets/types/schemas";

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	description: z.string().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const projectsSchema = z.array(projectSchema);

export const projectMemberSchema = ticketUserSchema;
export const projectMembersSchema = z.array(projectMemberSchema);

/* Inputs */

export const createProjectInputSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	description: z.string().optional(),
});

export const updateProjectInputSchema = createProjectInputSchema.partial();

export const projectMemberInputSchema = z.object({
	userId: z.string(),
});

export const projectTeamInputSchema = z.object({
	teamId: z.string(),
});
