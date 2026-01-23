import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "./profile";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	post: ReturnType<typeof vi.fn>;
	put: ReturnType<typeof vi.fn>;
	delete: ReturnType<typeof vi.fn>;
};

describe("profile API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("updateProfileInformation", () => {
		it("should call update profile endpoint", async () => {
			mockClient.put.mockResolvedValueOnce({});

			const input = {
				displayName: "New Name",
				email: "new@example.com",
			};

			await updateProfileInformation(input);

			expect(mockClient.put).toHaveBeenCalledWith(
				"/user/profile-information",
				input,
			);
		});
	});

	describe("updateAvatar", () => {
		it("should convert file to base64 and upload", async () => {
			mockClient.post.mockResolvedValueOnce({});

			// Create a mock file
			const mockFileContent = "test-image-content";
			const mockFile = new File([mockFileContent], "avatar.png", {
				type: "image/png",
			});

			await updateAvatar(mockFile);

			expect(mockClient.post).toHaveBeenCalledWith("/user/avatar", {
				avatar: expect.stringContaining("data:"),
			});
		});
	});

	describe("deleteAvatar", () => {
		it("should call delete avatar endpoint", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await deleteAvatar();

			expect(mockClient.delete).toHaveBeenCalledWith("/user/avatar");
		});
	});
});
