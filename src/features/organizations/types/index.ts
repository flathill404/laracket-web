import type { z } from "zod";
import type * as schemas from "./schemas";

export type Organization = z.infer<typeof schemas.organizationSchema>;
export type OrganizationMember = z.infer<
	typeof schemas.organizationMemberSchema
>;

export type CreateOrganizationInput = z.infer<
	typeof schemas.createOrganizationInputSchema
>;
export type UpdateOrganizationInput = z.infer<
	typeof schemas.updateOrganizationInputSchema
>;
export type OrganizationMemberInput = z.infer<
	typeof schemas.organizationMemberInputSchema
>;
export type UpdateOrganizationMemberInput = z.infer<
	typeof schemas.updateOrganizationMemberInputSchema
>;
export type CreateOrganizationProjectInput = z.infer<
	typeof schemas.createOrganizationProjectInputSchema
>;
export type CreateOrganizationTeamInput = z.infer<
	typeof schemas.createOrganizationTeamInputSchema
>;

export * from "./schemas";
