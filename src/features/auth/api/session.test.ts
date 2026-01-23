import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchUser, login, logout } from "./session";

// Mock the client module
vi.mock("@/lib/client", () => ({
	client: {
		get: vi.fn(),
		post: vi.fn(),
	},
}));

import { client } from "@/lib/client";

const mockClient = client as unknown as {
	get: ReturnType<typeof vi.fn>;
	post: ReturnType<typeof vi.fn>;
};

describe("auth session API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchUser", () => {
		it("should fetch and parse user data", async () => {
			const mockUser = {
				id: "user-123",
				name: "john_doe",
				displayName: "John Doe",
				email: "john@example.com",
				emailVerifiedAt: "2024-01-01T00:00:00Z",
				avatarUrl: "https://example.com/avatar.jpg",
				twoFactorStatus: "disabled",
			};

			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: mockUser }),
			});

			const result = await fetchUser();

			expect(mockClient.get).toHaveBeenCalledWith("/user");
			expect(result).toEqual(mockUser);
		});

		it("should throw if user data is invalid", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ data: { invalid: "data" } }),
			});

			await expect(fetchUser()).rejects.toThrow();
		});
	});

	describe("login", () => {
		it("should call csrf-cookie first, then login", async () => {
			mockClient.get.mockResolvedValueOnce({}); // csrf-cookie
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ twoFactor: false }),
			});

			const credentials = {
				email: "test@example.com",
				password: "password123",
				remember: false,
			};

			const result = await login(credentials);

			expect(mockClient.get).toHaveBeenCalledWith("/csrf-cookie");
			expect(mockClient.post).toHaveBeenCalledWith("/login", credentials);
			expect(result).toEqual({ twoFactor: false });
		});

		it("should return twoFactor: true when 2FA is required", async () => {
			mockClient.get.mockResolvedValueOnce({});
			mockClient.post.mockResolvedValueOnce({
				json: () => Promise.resolve({ twoFactor: true }),
			});

			const credentials = {
				email: "test@example.com",
				password: "password123",
				remember: false,
			};

			const result = await login(credentials);

			expect(result.twoFactor).toBe(true);
		});
	});

	describe("logout", () => {
		it("should call logout endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await logout();

			expect(mockClient.post).toHaveBeenCalledWith("/logout");
		});
	});
});
