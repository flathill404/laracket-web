import type { z } from "zod";
import type { organizationMemberSchema, organizationSchema } from "./schemas";

export type Organization = z.infer<typeof organizationSchema>;
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;

// Re-export all schemas
export * from "./schemas";
