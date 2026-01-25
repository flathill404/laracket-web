import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { register, sendVerificationEmail } from "./registration";

vi.mock("@/lib/client");

import { getMockClient } from "@/test/utils";

const mockClient = getMockClient();

describe("registration API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("register", () => {
		it("should call csrf-cookie first, then register", async () => {
			mockClient.get.mockResolvedValueOnce({});
			mockClient.post.mockResolvedValueOnce({});

			const input = {
				name: "johndoe",
				displayName: "John Doe",
				email: "john@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			};

			await register(input);

			expect(mockClient.get).toHaveBeenCalledWith("/csrf-cookie");
			expect(mockClient.post).toHaveBeenCalledWith("/register", input);
		});

		it("should call get before post", async () => {
			const callOrder: string[] = [];
			mockClient.get.mockImplementation(async () => {
				callOrder.push("get");
				return {};
			});
			mockClient.post.mockImplementation(async () => {
				callOrder.push("post");
				return {};
			});

			await register({
				name: "test",
				displayName: "Test",
				email: "test@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			});

			expect(callOrder).toEqual(["get", "post"]);
		});
	});

	describe("sendVerificationEmail", () => {
		it("should call verification notification endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await sendVerificationEmail();

			expect(mockClient.post).toHaveBeenCalledWith(
				"/email/verification-notification",
			);
		});
	});
});
