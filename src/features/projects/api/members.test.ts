import { getMockClient } from "@/test/utils";
import {
	addProjectMember,
	fetchProjectMembers,
	removeProjectMember,
} from "./members";

vi.mock("@/lib/client");

const mockClient = getMockClient();

const mockMember = {
	id: "user-123",
	name: "john",
	displayName: "John Doe",
	avatarUrl: "https://example.com/avatar.jpg",
};

describe("members API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
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
