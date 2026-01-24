import type { z } from "zod";
import type { projectSchema } from "./schemas";

export type Project = z.infer<typeof projectSchema>;

// Re-export all schemas
export * from "./schemas";
