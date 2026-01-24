import { z } from "zod";

import { ticketUserSchema } from "@/features/tickets/types/schemas";

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	description: z.string(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const projectsSchema = z.array(projectSchema);

export const projectMemberSchema = ticketUserSchema;
export const projectMembersSchema = z.array(projectMemberSchema);
