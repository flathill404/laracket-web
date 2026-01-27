import type { z } from "zod";
import type * as schemas from "./schemas";

export type Project = z.infer<typeof schemas.projectSchema>;
export type ProjectMember = z.infer<typeof schemas.projectMemberSchema>;

export type CreateProjectInput = z.infer<
	typeof schemas.createProjectInputSchema
>;
export type UpdateProjectInput = z.infer<
	typeof schemas.updateProjectInputSchema
>;
export type ProjectMemberInput = z.infer<
	typeof schemas.projectMemberInputSchema
>;
export type ProjectTeamInput = z.infer<typeof schemas.projectTeamInputSchema>;
export type FetchTicketsOptions = z.infer<
	typeof schemas.fetchTicketsOptionsSchema
>;

export * from "./schemas";
