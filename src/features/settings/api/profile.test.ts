import { describe, expect, it } from "vitest";

import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "./profile";

describe("profile API", () => {
	describe("updateProfileInformation", () => {
		it("should call update profile endpoint", async () => {
			const input = {
				displayName: "New Name",
				email: "new@example.com",
			};

			await expect(updateProfileInformation(input)).resolves.not.toThrow();
		});
	});

	describe("updateAvatar", () => {
		it("should convert file to base64 and upload", async () => {
			const mockFileContent = "test-image-content";
			const mockFile = new File([mockFileContent], "avatar.png", {
				type: "image/png",
			});

			await expect(updateAvatar(mockFile)).resolves.not.toThrow();
		});
	});

	describe("deleteAvatar", () => {
		it("should call delete avatar endpoint", async () => {
			await expect(deleteAvatar()).resolves.not.toThrow();
		});
	});
});
