import type {
	Organization,
	OrganizationMember,
} from "@/features/organizations/types";

export const createOrganization = (
	overrides?: Partial<Organization>,
): Organization => ({
	id: "org-123",
	name: "test-org",
	displayName: "Test Organization",
	...overrides,
});

export const createOrganizations = (count: number): Organization[] =>
	Array.from({ length: count }, (_, i) =>
		createOrganization({
			id: `org-${i + 1}`,
			name: `test-org-${i + 1}`,
			displayName: `Test Organization ${i + 1}`,
		}),
	);

export const createOrganizationMember = (
	overrides?: Partial<OrganizationMember>,
): OrganizationMember => ({
	id: "user-123",
	name: "john_doe",
	displayName: "John Doe",
	avatarUrl: null,
	role: "member",
	...overrides,
});
