// @vitest-environment jsdom
import { QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import * as api from "@/features/auth/api";
import { createTestQueryClient } from "@/test/utils";
import { useTwoFactor } from "./useTwoFactor";

// Helper to type-safe mocks
const mockApi = vi.mocked(api);

vi.mock("@/features/auth/api", () => ({
	confirmPassword: vi.fn(),
	confirmTwoFactor: vi.fn(),
	disableTwoFactor: vi.fn(),
	enableTwoFactor: vi.fn(),
	fetchTwoFactorQrCode: vi.fn(),
	fetchTwoFactorRecoveryCodes: vi.fn(),
	fetchUser: vi.fn(),
}));

const baseMockUser = {
	id: "1",
	name: "Test User",
	email: "test@example.com",
} as const;

describe("useTwoFactor", () => {
	it("initializes with pending state", async () => {
		mockApi.fetchUser.mockResolvedValue({
			...baseMockUser,
			twoFactorStatus: "pending",
		});
		mockApi.fetchTwoFactorQrCode.mockResolvedValue({ svg: "<svg />" });

		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		await waitFor(() => expect(result.current.isPending).toBe(true));
		expect(result.current.isConfirmed).toBe(false);
	});

	it("initializes with confirmed state", async () => {
		mockApi.fetchUser.mockResolvedValue({
			...baseMockUser,
			twoFactorStatus: "enabled",
		});
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		await waitFor(() => expect(result.current.isPending).toBe(false));
		expect(result.current.isConfirmed).toBe(true);
	});

	it("handleEnableClick opens confirm password dialog", async () => {
		mockApi.fetchUser.mockResolvedValue({
			...baseMockUser,
			twoFactorStatus: "disabled",
		});
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		await waitFor(() => expect(result.current.isPending).toBe(false));

		act(() => {
			result.current.handleEnableClick();
		});

		expect(result.current.confirmPasswordOpen).toBe(true);
	});

	it("completes enablement flow", async () => {
		mockApi.fetchUser.mockResolvedValue({
			...baseMockUser,
			twoFactorStatus: "disabled",
		});
		mockApi.fetchTwoFactorRecoveryCodes.mockResolvedValue(["abc", "def"]);
		mockApi.fetchTwoFactorQrCode.mockResolvedValue({ svg: "<svg />" });

		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const { result } = renderHook(() => useTwoFactor(), { wrapper });

		await waitFor(() => expect(result.current.isPending).toBe(false));

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
