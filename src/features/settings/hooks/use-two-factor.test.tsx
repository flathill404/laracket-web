// @vitest-environment jsdom

import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/features/auth/api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createTestQueryClient } from "@/test/utils";
import { useTwoFactor } from "./use-two-factor";

vi.mock("@/features/auth/hooks/use-auth", () => ({
	useAuth: vi.fn(),
}));

// Helper to type-safe mocks
const mockUseAuth = vi.mocked(useAuth);
const mockApi = vi.mocked(api);

vi.mock("@/features/auth/api", () => ({
	confirmPassword: vi.fn(),
	confirmTwoFactor: vi.fn(),
	disableTwoFactor: vi.fn(),
	enableTwoFactor: vi.fn(),
	fetchTwoFactorQrCode: vi.fn(),
	fetchTwoFactorRecoveryCodes: vi.fn(),
}));

describe("useTwoFactor", () => {
	it("initializes with pending state", () => {
		mockUseAuth.mockReturnValue({
			user: { twoFactorStatus: "pending" },
		} as unknown as ReturnType<typeof useAuth>);
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		expect(result.current.isPending).toBe(true);
		expect(result.current.isConfirmed).toBe(false);
	});

	it("initializes with confirmed state", () => {
		mockUseAuth.mockReturnValue({
			user: { twoFactorStatus: "enabled" },
		} as unknown as ReturnType<typeof useAuth>);
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		expect(result.current.isPending).toBe(false);
		expect(result.current.isConfirmed).toBe(true);
	});

	it("handleEnableClick opens confirm password dialog", () => {
		mockUseAuth.mockReturnValue({
			user: { twoFactorStatus: "disabled" },
		} as unknown as ReturnType<typeof useAuth>);
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		act(() => {
			result.current.handleEnableClick();
		});

		expect(result.current.confirmPasswordOpen).toBe(true);
	});

	it("completes enablement flow", async () => {
		mockUseAuth.mockReturnValue({
			user: { twoFactorStatus: "disabled" },
		} as unknown as ReturnType<typeof useAuth>);
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		// 1. Click enable
		act(() => result.current.handleEnableClick());

		// 2. Enter password and confirm
		act(() => result.current.setPassword("password"));
		mockApi.confirmPassword.mockResolvedValue(undefined);
		mockApi.enableTwoFactor.mockResolvedValue(undefined);

		act(() => result.current.handlePasswordConfirm());

		await waitFor(() =>
			expect(api.confirmPassword).toHaveBeenCalledWith(
				{
					password: "password",
				},
				expect.anything(),
			),
		);
		await waitFor(() => expect(api.enableTwoFactor).toHaveBeenCalled());

		// 3. Confirm with code
		act(() => result.current.setConfirmationCode("123456"));
		mockApi.confirmTwoFactor.mockResolvedValue(undefined);

		act(() => result.current.handleConfirm());

		await waitFor(() =>
			expect(api.confirmTwoFactor).toHaveBeenCalledWith(
				{ code: "123456" },
				expect.anything(),
			),
		);
	});
});
