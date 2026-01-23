import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./use-auth";

// Mock the navigate function
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

// Mock the API functions
vi.mock("@/features/auth/api", () => ({
	login: vi.fn(),
	logout: vi.fn(),
	twoFactorChallenge: vi.fn(),
	forgotPassword: vi.fn(),
	resetPassword: vi.fn(),
	register: vi.fn(),
	loginInputSchema: {
		parse: vi.fn(),
	},
}));

// Mock user query options
const mockFetchUser = vi.fn();

vi.mock("../lib/auth", () => ({
	userQueryOptions: {
		queryKey: ["user"],
		queryFn: () => mockFetchUser(),
	},
}));

describe("useAuth", () => {
	let queryClient: QueryClient;

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("user state", () => {
		it("should return user when authenticated", async () => {
			const mockUser = {
				id: "user-123",
				name: "john",
				email: "john@example.com",
				twoFactorStatus: "disabled",
			};
			mockFetchUser.mockResolvedValueOnce(mockUser);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.user).toEqual(mockUser);
			expect(result.current.isAuthenticated).toBe(true);
		});

		it("should return null when not authenticated", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(result.current.user).toBeNull();
			expect(result.current.isAuthenticated).toBe(false);
		});

		it("should show loading state initially", () => {
			mockFetchUser.mockImplementation(
				() => new Promise(() => {}), // Never resolves
			);

			const { result } = renderHook(() => useAuth(), { wrapper });

			expect(result.current.isLoading).toBe(true);
		});
	});

	describe("returned functions", () => {
		it("should expose login function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.login).toBe("function");
		});

		it("should expose logout function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.logout).toBe("function");
		});

		it("should expose twoFactorChallenge function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.twoFactorChallenge).toBe("function");
		});

		it("should expose forgotPassword function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.forgotPassword).toBe("function");
		});

		it("should expose resetPassword function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.resetPassword).toBe("function");
		});

		it("should expose register function", async () => {
			mockFetchUser.mockResolvedValueOnce(null);

			const { result } = renderHook(() => useAuth(), { wrapper });

			await waitFor(() => {
				expect(result.current.isLoading).toBe(false);
			});

			expect(typeof result.current.register).toBe("function");
		});
	});
});
