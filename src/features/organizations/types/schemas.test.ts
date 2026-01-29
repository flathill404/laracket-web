import { describe, expect, it } from "vitest";
import {
	createOrganizationInputSchema,
	createOrganizationProjectInputSchema,
	createOrganizationTeamInputSchema,
	organizationMemberInputSchema,
	organizationMemberSchema,
	organizationSchema,
	updateOrganizationMemberInputSchema,
} from "./schemas";

describe("organizationSchema", () => {
	it("validates a valid organization", () => {
		const valid = { id: "1", name: "org", displayName: "Org" };
		expect(organizationSchema.parse(valid)).toEqual(valid);
	});

	it("throws when required fields are missing", () => {
		expect(() => organizationSchema.parse({})).toThrow();
	});
});

describe("organizationMemberSchema", () => {
	it("validates a valid member", () => {
		const valid = { id: "1", name: "user", displayName: "User" };
		expect(organizationMemberSchema.parse(valid)).toEqual(valid);
	});

	it("validates a member with optional fields", () => {
		const valid = {
			id: "1",
			name: "user",
			displayName: "User",
			avatarUrl: "http://example.com/avatar.jpg",
			role: "admin",
		};
		expect(organizationMemberSchema.parse(valid)).toEqual(valid);
	});
});

describe("createOrganizationInputSchema", () => {
	it("validates a valid input", () => {
		const valid = { name: "org", displayName: "Org" };
		expect(createOrganizationInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws when fields are empty", () => {
		expect(() =>
			createOrganizationInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});

describe("organizationMemberInputSchema", () => {
	it("validates a valid input", () => {
		const valid = { userId: "user-1" };
		expect(organizationMemberInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws when userId is missing", () => {
		expect(() => organizationMemberInputSchema.parse({})).toThrow();
	});
});

describe("updateOrganizationMemberInputSchema", () => {
	it("validates a valid role", () => {
		const valid = { role: "admin" };
		expect(updateOrganizationMemberInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws without a valid role", () => {
		expect(() =>
			updateOrganizationMemberInputSchema.parse({ role: "invalid" }),
		).toThrow();
	});
});

describe("createOrganizationProjectInputSchema", () => {
	it("validates a valid input", () => {
		const valid = { name: "proj", displayName: "Project" };
		expect(createOrganizationProjectInputSchema.parse(valid)).toEqual(valid);
	});

	it("validates input with a description", () => {
		const valid = { name: "proj", displayName: "Project", description: "Desc" };
		expect(createOrganizationProjectInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws when fields are empty", () => {
		expect(() =>
			createOrganizationProjectInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});

describe("createOrganizationTeamInputSchema", () => {
	it("validates a valid input", () => {
		const valid = { name: "team", displayName: "Team" };
		expect(createOrganizationTeamInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws when fields are empty", () => {
		expect(() =>
			createOrganizationTeamInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});
