import type { z } from "zod";
import type * as schemas from "./schemas";

export type Team = z.infer<typeof schemas.teamSchema>;
export type TeamMember = z.infer<typeof schemas.teamMemberSchema>;

export type CreateTeamInput = z.infer<typeof schemas.createTeamInputSchema>;
export type UpdateTeamInput = z.infer<typeof schemas.updateTeamInputSchema>;
export type TeamMemberInput = z.infer<typeof schemas.teamMemberInputSchema>;
export type UpdateTeamMemberInput = z.infer<
	typeof schemas.updateTeamMemberInputSchema
>;

export * from "./schemas";
