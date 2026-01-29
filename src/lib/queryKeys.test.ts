import { describe, expect, it } from "vitest";
import { queryKeys } from "./queryKeys";

describe("queryKeys", () => {
	describe("user", () => {
		it("returns the correct key", () => {
			expect(queryKeys.user()).toEqual(["user"]);
		});
	});

	describe("projects", () => {
		it("returns the correct keys structure", () => {
			expect(queryKeys.projects.all()).toEqual(["projects"]);
			expect(queryKeys.projects.list("123")).toEqual(["projects", "123"]);
			expect(queryKeys.projects.detail("456")).toEqual(["projects", "456"]);
			expect(queryKeys.projects.members("456")).toEqual([
				"projects",
				"456",
				"members",
			]);
			expect(queryKeys.projects.tickets("456")).toEqual([
				"projects",
				"456",
				"tickets",
			]);
		});
	});

	describe("tickets", () => {
		it("returns the correct keys structure", () => {
			expect(queryKeys.tickets.all()).toEqual(["tickets"]);
			expect(queryKeys.tickets.detail("789")).toEqual(["tickets", "789"]);
			expect(queryKeys.tickets.activities("789")).toEqual([
				"tickets",
				"789",
				"activities",
			]);
			expect(queryKeys.tickets.comments("789")).toEqual([
				"tickets",
				"789",
				"comments",
			]);
		});
	});

	describe("teams", () => {
		it("returns the correct keys structure", () => {
			expect(queryKeys.teams.all()).toEqual(["teams"]);
			expect(queryKeys.teams.list("user1")).toEqual(["teams", "user1"]);
			expect(queryKeys.teams.detail("team1")).toEqual(["teams", "team1"]);
			expect(queryKeys.teams.members("team1")).toEqual([
				"teams",
				"team1",
				"members",
			]);
			expect(queryKeys.teams.tickets("team1")).toEqual([
				"teams",
				"team1",
				"tickets",
			]);
		});
	});

	describe("organizations", () => {
		it("returns the correct keys structure", () => {
			expect(queryKeys.organizations.all()).toEqual(["organizations"]);
			expect(queryKeys.organizations.list()).toEqual(["organizations", "list"]);
			expect(queryKeys.organizations.detail("org1")).toEqual([
				"organizations",
				"org1",
			]);
			expect(queryKeys.organizations.members("org1")).toEqual([
				"organizations",
				"org1",
				"members",
			]);
			expect(queryKeys.organizations.projects("org1")).toEqual([
				"organizations",
				"org1",
				"projects",
			]);
			expect(queryKeys.organizations.teams("org1")).toEqual([
				"organizations",
				"org1",
				"teams",
			]);
		});
	});

	describe("users", () => {
		it("returns the correct keys structure", () => {
			expect(queryKeys.users.tickets("user1")).toEqual([
				"users",
				"user1",
				"tickets",
			]);
		});
	});
});
