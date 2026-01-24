import { z } from "zod";

export const organizationSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
});

export const organizationsSchema = z.array(organizationSchema);
