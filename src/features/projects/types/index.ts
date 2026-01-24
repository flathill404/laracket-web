import type { z } from "zod";
import type { projectMemberSchema, projectSchema } from "./schemas";

export type Project = z.infer<typeof projectSchema>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;

export * from "./schemas";
