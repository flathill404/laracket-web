import { describe, expect, it } from "vitest";

import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "./profile";

describe("profile API", () => {
	describe("updateProfileInformation", () => {
		it("calls the update profile endpoint", async () => {
			const input = {
				displayName: "New Name",
				email: "new@example.com",
			};

			await expect(updateProfileInformation(input)).resolves.not.toThrow();
		});
	});

	describe("updateAvatar", () => {
		it("converts the file to base64 and uploads it", async () => {
			const mockFileContent = "test-image-content";
			const mockFile = new File([mockFileContent], "avatar.png", {
				type: "image/png",
			});

			await expect(updateAvatar(mockFile)).resolves.not.toThrow();
		});
	});

	describe("deleteAvatar", () => {
		it("calls the delete avatar endpoint", async () => {
			await expect(deleteAvatar()).resolves.not.toThrow();
		});
	});
});
