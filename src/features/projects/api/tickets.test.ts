import { getMockClient } from "@/test/utils";
import { fetchProjectTickets } from "./tickets";

vi.mock("@/lib/client");

const mockClient = getMockClient();

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

describe("tickets API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
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
				filters: { status: ["open", "in_progress"] },
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

			await fetchProjectTickets("project-123", {
				pagination: { cursor: "abc123" },
			});

			expect(mockClient.get).toHaveBeenCalledWith(
				"/projects/project-123/tickets?cursor=abc123",
			);
		});
	});
});
