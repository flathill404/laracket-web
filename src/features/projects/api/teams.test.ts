import { getMockClient } from "@/test/utils";
import { addProjectTeam, removeProjectTeam } from "./teams";

vi.mock("@/lib/client");

const mockClient = getMockClient();

describe("teams API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

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
