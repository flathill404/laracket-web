import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	confirmPassword,
	forgotPassword,
	resetPassword,
	updatePassword,
} from "./password";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		post: vi.fn(),
		put: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	post: ReturnType<typeof vi.fn>;
	put: ReturnType<typeof vi.fn>;
};

describe("password API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("confirmPassword", () => {
		it("should call confirm password endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await confirmPassword({ password: "mypassword" });

			expect(mockClient.post).toHaveBeenCalledWith("/user/confirm-password", {
				password: "mypassword",
			});
		});
	});

	describe("updatePassword", () => {
		it("should call update password endpoint", async () => {
			mockClient.put.mockResolvedValueOnce({});

			const input = {
				currentPassword: "oldpassword",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
			};

			await updatePassword(input);

			expect(mockClient.put).toHaveBeenCalledWith("/user/password", input);
		});
	});

	describe("forgotPassword", () => {
		it("should call forgot password endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await forgotPassword({ email: "test@example.com" });

			expect(mockClient.post).toHaveBeenCalledWith("/forgot-password", {
				email: "test@example.com",
			});
		});
	});

	describe("resetPassword", () => {
		it("should call reset password endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			const input = {
				email: "test@example.com",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
				token: "reset-token-abc",
			};

			await resetPassword(input);

			expect(mockClient.post).toHaveBeenCalledWith("/reset-password", input);
		});
	});
});
