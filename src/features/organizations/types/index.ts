import type { z } from "zod";
import type { organizationSchema } from "./schemas";

export type Organization = z.infer<typeof organizationSchema>;

// Re-export all schemas
export * from "./schemas";
