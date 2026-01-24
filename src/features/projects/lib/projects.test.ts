import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import * as api from "../api/projects";
import {
	projectMembersQueryOptions,
	projectQueryOptions,
	projectsQueryOptions,
} from "./projects";

vi.mock("../api/projects", () => ({
	fetchProjects: vi.fn(),
	fetchProjectMembers: vi.fn(),
	fetchProject: vi.fn(),
}));

describe("projects lib", () => {
	it("projectsQueryOptions", async () => {
		const userId = "user-1";
		const options = projectsQueryOptions(userId);
		expect(options.queryKey).toEqual(queryKeys.projects.list(userId));
		// @ts-expect-error
		await options.queryFn();
		expect(api.fetchProjects).toHaveBeenCalledWith(userId);
	});

	it("projectMembersQueryOptions", () => {
		const projectId = "proj-1";
		const options = projectMembersQueryOptions(projectId);
		expect(options.queryKey).toEqual(queryKeys.projects.members(projectId));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchProjectMembers).toHaveBeenCalledWith(projectId);
	});

	it("projectQueryOptions", () => {
		const projectId = "proj-1";
		const options = projectQueryOptions(projectId);
		expect(options.queryKey).toEqual(queryKeys.projects.detail(projectId));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchProject).toHaveBeenCalledWith(projectId);
	});
});
