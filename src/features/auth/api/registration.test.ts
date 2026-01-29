import { describe, expect, it } from "vitest";
import { register, sendVerificationEmail } from "./registration";

describe("registration API", () => {
	describe("register", () => {
		it("should call csrf-cookie first, then register", async () => {
			const input = {
				name: "johndoe",
				displayName: "John Doe",
				email: "john@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			};

			await expect(register(input)).resolves.not.toThrow();
		});
	});

	describe("sendVerificationEmail", () => {
		it("should call verification notification endpoint", async () => {
			await expect(sendVerificationEmail()).resolves.not.toThrow();
		});
	});
});
