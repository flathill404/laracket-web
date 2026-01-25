import { describe, expect, it, vi } from "vitest";
import * as authApi from "@/features/auth/api";
import { renderHook, waitFor } from "@/test/utils";
import { useAuth } from "./useAuth";

// Mock API
vi.mock("@/features/auth/api");

// Mock useNavigate from router
const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
	// biome-ignore lint/suspicious/noExplicitAny: actual module can have any type for mocking
	const actual = (await importOriginal()) as any;
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

describe("useAuth", () => {
	it("returns user data when authenticated", async () => {
		vi.spyOn(authApi, "fetchUser").mockResolvedValue({
			id: "1",
			email: "test@example.com",
			name: "Test User",
			displayName: "Test",
			avatarUrl: null,
			emailVerifiedAt: "2023-01-01",
			twoFactorStatus: "enabled",
		});

		const { result } = renderHook(() => useAuth());

		await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
		expect(result.current.user).toEqual(
			expect.objectContaining({ email: "test@example.com" }),
		);
	});

	it("handles login", async () => {
		const loginSpy = vi
			.spyOn(authApi, "login")
			.mockResolvedValue({ twoFactor: false });

		const { result } = renderHook(() => useAuth());

		await result.current.login({
			email: "test@example.com",
			password: "password",
			remember: false,
		});

		expect(loginSpy.mock.calls[0][0]).toEqual({
			email: "test@example.com",
			password: "password",
			remember: false,
		});
	});

	it("handles logout", async () => {
		const logoutSpy = vi.spyOn(authApi, "logout").mockResolvedValue();
		const { result } = renderHook(() => useAuth());

		await result.current.logout();

		expect(logoutSpy).toHaveBeenCalled();
		expect(navigateMock).toHaveBeenCalledWith({ to: "/login" });
	});
});
