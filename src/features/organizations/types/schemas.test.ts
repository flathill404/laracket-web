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
	it("validates valid organization", () => {
		const valid = { id: "1", name: "org", displayName: "Org" };
		expect(organizationSchema.parse(valid)).toEqual(valid);
	});

	it("throws on missing fields", () => {
		expect(() => organizationSchema.parse({})).toThrow();
	});
});

describe("organizationMemberSchema", () => {
	it("validates valid member", () => {
		const valid = { id: "1", name: "user", displayName: "User" };
		expect(organizationMemberSchema.parse(valid)).toEqual(valid);
	});

	it("validates member with optional fields", () => {
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
	it("validates valid input", () => {
		const valid = { name: "org", displayName: "Org" };
		expect(createOrganizationInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws on empty strings", () => {
		expect(() =>
			createOrganizationInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});

describe("organizationMemberInputSchema", () => {
	it("validates valid input", () => {
		const valid = { userId: "user-1" };
		expect(organizationMemberInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws on missing userId", () => {
		expect(() => organizationMemberInputSchema.parse({})).toThrow();
	});
});

describe("updateOrganizationMemberInputSchema", () => {
	it("validates valid role", () => {
		const valid = { role: "admin" };
		expect(updateOrganizationMemberInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws on invalid role", () => {
		expect(() =>
			updateOrganizationMemberInputSchema.parse({ role: "invalid" }),
		).toThrow();
	});
});

describe("createOrganizationProjectInputSchema", () => {
	it("validates valid input", () => {
		const valid = { name: "proj", displayName: "Project" };
		expect(createOrganizationProjectInputSchema.parse(valid)).toEqual(valid);
	});

	it("validates input with description", () => {
		const valid = { name: "proj", displayName: "Project", description: "Desc" };
		expect(createOrganizationProjectInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws on empty strings", () => {
		expect(() =>
			createOrganizationProjectInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});

describe("createOrganizationTeamInputSchema", () => {
	it("validates valid input", () => {
		const valid = { name: "team", displayName: "Team" };
		expect(createOrganizationTeamInputSchema.parse(valid)).toEqual(valid);
	});

	it("throws on empty strings", () => {
		expect(() =>
			createOrganizationTeamInputSchema.parse({ name: "", displayName: "" }),
		).toThrow();
	});
});
