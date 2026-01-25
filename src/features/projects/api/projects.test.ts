import { getMockClient } from "@/test/utils";
import { projectSchema } from "../types/schemas";
import {
	addProjectMember,
	addProjectTeam,
	deleteProject,
	fetchProject,
	fetchProjectMembers,
	fetchProjects,
	fetchProjectTickets,
	removeProjectMember,
	removeProjectTeam,
	updateProject,
} from "./projects";

vi.mock("@/lib/client");

const mockClient = getMockClient();

const mockProject = {
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "A test project",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

const mockMember = {
	id: "user-123",
	name: "john",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
};

const mockTicket = {
	id: "ticket-123",
	title: "Test Ticket",
	description: "Test description",
	status: "open",
	dueDate: null,
	assignees: [],
	reviewers: [],
	projectId: "project-123",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

describe("projects API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("schemas", () => {
		describe("projectSchema", () => {
			it("should validate a valid project", () => {
				expect(() => projectSchema.parse(mockProject)).not.toThrow();
			});

			it("should reject missing required fields", () => {
				const invalid = { id: "123" };
				expect(() => projectSchema.parse(invalid)).toThrow();
			});
		});
	});

	describe("fetchProjects", () => {
		it("should fetch user projects", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockProject] }),
			});

			const result = await fetchProjects("user-123");

			expect(mockClient.get).toHaveBeenCalledWith("/users/user-123/projects");
			expect(result).toEqual([mockProject]);
		});
	});

	describe("fetchProject", () => {
		it("should fetch single project", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockProject }),
			});

			const result = await fetchProject("project-123");

			expect(mockClient.get).toHaveBeenCalledWith("/projects/project-123");
			expect(result).toEqual(mockProject);
		});
	});

	describe("updateProject", () => {
		it("should update project", async () => {
			const updateData = { name: "updated-name", description: "updated desc" };
			const updated = { ...mockProject, ...updateData };
			mockClient.put.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: updated }),
			});

			const result = await updateProject("project-123", updateData);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/projects/project-123",
				updateData,
			);
			expect(result.name).toBe("updated-name");
			expect(result.description).toBe("updated desc");
		});
	});

	describe("fetchProjectTickets", () => {
		it("should fetch project tickets without filters", async () => {
			const paginatedResponse = {
				data: [mockTicket],
				links: { first: null, last: null, prev: null, next: null },
				meta: {
					path: "/api/tickets",
					perPage: 10,
					nextCursor: null,
					prevCursor: null,
				},
			};
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve(paginatedResponse),
			});

			const result = await fetchProjectTickets("project-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/tickets",
			);
			expect(result.data).toEqual([mockTicket]);
		});

		it("should fetch project tickets with status filter", async () => {
			const paginatedResponse = {
				data: [mockTicket],
				links: { first: null, last: null, prev: null, next: null },
				meta: {
					path: "/api/tickets",
					perPage: 10,
					nextCursor: null,
					prevCursor: null,
				},
			};
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve(paginatedResponse),
			});

			await fetchProjectTickets("project-123", {
				status: ["open", "in_progress"],
			});

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/tickets?status%5B%5D=open&status%5B%5D=in_progress",
			);
		});

		it("should fetch project tickets with sort", async () => {
			const paginatedResponse = {
				data: [mockTicket],
				links: { first: null, last: null, prev: null, next: null },
				meta: {
					path: "/api/tickets",
					perPage: 10,
					nextCursor: null,
					prevCursor: null,
				},
			};
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve(paginatedResponse),
			});

			await fetchProjectTickets("project-123", { sort: "-due_date" });

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/tickets?sort=-due_date",
			);
		});

		it("should fetch project tickets with cursor", async () => {
			const paginatedResponse = {
				data: [mockTicket],
				links: { first: null, last: null, prev: null, next: null },
				meta: {
					path: "/api/tickets",
					perPage: 10,
					nextCursor: null,
					prevCursor: null,
				},
			};
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve(paginatedResponse),
			});

			await fetchProjectTickets("project-123", { cursor: "abc123" });

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/tickets?cursor=abc123",
			);
		});
	});

	describe("fetchProjectMembers", () => {
		it("should fetch project members", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: [mockMember] }),
			});

			const result = await fetchProjectMembers("project-123");

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/members",
			);
			expect(result).toEqual([mockMember]);
		});
	});

	describe("deleteProject", () => {
		it("should delete project", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteProject("project-123");

			expect(mockClient.delete).toHaveBeenCalledWith("/projects/project-123");
		});
	});

	describe("members", () => {
		describe("addProjectMember", () => {
			it("should add member", async () => {
				mockClient.post.mockResolvedValueOnce({
					json: () => Promise.resolve({ data: mockMember }),
				});

				const result = await addProjectMember("project-123", {
					userId: "user-123",
				});

				expect(mockClient.post).toHaveBeenCalledWith(
					"/projects/project-123/members",
					{ userId: "user-123" },
				);
				expect(result).toEqual(mockMember);
			});
		});

		describe("removeProjectMember", () => {
			it("should remove member", async () => {
				mockClient.delete.mockResolvedValueOnce({});

				await removeProjectMember("project-123", "user-123");

				expect(mockClient.delete).toHaveBeenCalledWith(
					"/projects/project-123/members/user-123",
				);
			});
		});
	});

	describe("teams", () => {
		describe("addProjectTeam", () => {
			it("should add team", async () => {
				mockClient.post.mockResolvedValueOnce({});

				await addProjectTeam("project-123", { teamId: "team-123" });

				expect(mockClient.post).toHaveBeenCalledWith(
					"/projects/project-123/teams",
					{ teamId: "team-123" },
				);
			});
		});

		describe("removeProjectTeam", () => {
			it("should remove team", async () => {
				mockClient.delete.mockResolvedValueOnce({});

				await removeProjectTeam("project-123", "team-123");

				expect(mockClient.delete).toHaveBeenCalledWith(
					"/projects/project-123/teams/team-123",
				);
			});
		});
	});
});
