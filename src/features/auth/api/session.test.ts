import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { fetchUser, login, logout } from "./session";

const BASE_URL = "http://localhost:8000/api";

describe("auth session API", () => {
	describe("fetchUser", () => {
		it("fetches and parses user data", async () => {
			const result = await fetchUser();

			expect(result.id).toBe("user-123");
			expect(result.email).toBe("john@example.com");
			expect(result.twoFactorStatus).toBe("disabled");
		});

		it("throws if user data is invalid", async () => {
			server.use(
				http.get(`${BASE_URL}/user`, () => {
					return HttpResponse.json({ data: { invalid: "data" } });
				}),
			);

			await expect(fetchUser()).rejects.toThrow();
		});
	});

	describe("login", () => {
		it("calls csrf-cookie first, then logs in", async () => {
			const credentials = {
				email: "test@example.com",
				password: "password123",
				remember: false,
			};

			const result = await login(credentials);

			expect(result).toEqual({ twoFactor: false });
		});

		it("returns twoFactor: true when 2FA is required", async () => {
			server.use(
				http.post(`${BASE_URL}/login`, () => {
					return HttpResponse.json({ twoFactor: true });
				}),
			);

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
		it("calls the logout endpoint", async () => {
			await expect(logout()).resolves.not.toThrow();
		});
	});
});
