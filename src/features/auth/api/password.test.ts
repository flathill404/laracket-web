import { describe, expect, it } from "vitest";
import {
	confirmPassword,
	forgotPassword,
	resetPassword,
	updatePassword,
} from "./password";

describe("password API", () => {
	describe("confirmPassword", () => {
		it("should call confirm password endpoint", async () => {
			await expect(
				confirmPassword({ password: "mypassword" }),
			).resolves.not.toThrow();
		});
	});

	describe("updatePassword", () => {
		it("should call update password endpoint", async () => {
			const input = {
				currentPassword: "oldpassword",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
			};

			await expect(updatePassword(input)).resolves.not.toThrow();
		});
	});

	describe("forgotPassword", () => {
		it("should call forgot password endpoint", async () => {
			await expect(
				forgotPassword({ email: "test@example.com" }),
			).resolves.not.toThrow();
		});
	});

	describe("resetPassword", () => {
		it("should call reset password endpoint", async () => {
			const input = {
				email: "test@example.com",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
				token: "reset-token-abc",
			};

			await expect(resetPassword(input)).resolves.not.toThrow();
		});
	});
});
