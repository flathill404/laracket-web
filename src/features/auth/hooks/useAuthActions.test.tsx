// @vitest-environment jsdom
import { waitFor } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { login, logout } from "@/features/auth/api";
import { renderHook } from "@/test/utils";
import { useAuthActions } from "./useAuthActions";

// Mock API
vi.mock("@/features/auth/api", () => ({
	login: vi.fn(),
	logout: vi.fn(),
	register: vi.fn(),
	forgotPassword: vi.fn(),
	resetPassword: vi.fn(),
	sendVerificationEmail: vi.fn(),
	twoFactorChallenge: vi.fn(),
}));

// Mock Router
const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => navigateMock,
}));

// Mock Queries
vi.mock("../utils/queries", () => ({
	authQueries: {
		user: () => ({ queryKey: ["auth", "user"] }),
	},
}));

describe("useAuthActions", () => {
	it("handles login success", async () => {
		const { result } = renderHook(() => useAuthActions());

		(login as Mock).mockResolvedValue({});

		result.current.login.mutate({
			email: "test@example.com",
			password: "password",
			remember: true,
		});

		await waitFor(() => expect(result.current.login.isSuccess).toBe(true));
		expect(login).toHaveBeenCalledWith(
			{
				email: "test@example.com",
				password: "password",
				remember: true,
			},
			expect.anything(),
		);
	});

	it("handles logout success", async () => {
		const { result } = renderHook(() => useAuthActions());

		(logout as Mock).mockResolvedValue({});

		result.current.logout.mutate();

		await waitFor(() => expect(result.current.logout.isSuccess).toBe(true));
		expect(logout).toHaveBeenCalledWith(undefined, expect.anything());
		expect(navigateMock).toHaveBeenCalledWith({ to: "/login" });
	});
});
