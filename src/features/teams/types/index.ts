import type { z } from "zod";
import type { teamMemberSchema, teamSchema } from "./schemas";

export type Team = z.infer<typeof teamSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;

export * from "./schemas";
