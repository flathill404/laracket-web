import type { z } from "zod";
import type { teamSchema } from "./schemas";

export type Team = z.infer<typeof teamSchema>;

// Re-export all schemas
export * from "./schemas";
