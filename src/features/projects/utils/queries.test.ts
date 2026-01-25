import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import * as api from "../api/projects";
import { projectQueries } from "./queries";

vi.mock("../api/projects", () => ({
	fetchProjects: vi.fn(),
	fetchProjectMembers: vi.fn(),
	fetchProject: vi.fn(),
}));

describe("projects queries", () => {
	it("projectQueries.list", async () => {
		const userId = "user-1";
		const options = projectQueries.list(userId);
		expect(options.queryKey).toEqual(queryKeys.projects.list(userId));
		// @ts-expect-error
		await options.queryFn();
		expect(api.fetchProjects).toHaveBeenCalledWith(userId);
	});

	it("projectQueries.members", () => {
		const projectId = "proj-1";
		const options = projectQueries.members(projectId);
		expect(options.queryKey).toEqual(queryKeys.projects.members(projectId));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchProjectMembers).toHaveBeenCalledWith(projectId);
	});

	it("projectQueries.detail", () => {
		const projectId = "proj-1";
		const options = projectQueries.detail(projectId);
		expect(options.queryKey).toEqual(queryKeys.projects.detail(projectId));
		// @ts-expect-error
		options.queryFn();
		expect(api.fetchProject).toHaveBeenCalledWith(projectId);
	});
});
