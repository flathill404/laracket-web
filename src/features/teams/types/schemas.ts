import { z } from "zod";

export const teamSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export const teamsSchema = z.array(teamSchema);
