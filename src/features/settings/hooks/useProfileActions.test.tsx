import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { authQueries } from "@/features/auth/utils/queries";
import {
	deleteAvatar,
	updateAvatar,
	updateProfileInformation,
} from "../api/profile";
import { useProfileActions } from "./useProfileActions";

// Mock API
vi.mock("../api/profile", () => ({
	deleteAvatar: vi.fn(),
	updateAvatar: vi.fn(),
	updateProfileInformation: vi.fn(),
}));

// Mock authQueries
vi.mock("@/features/auth/utils/queries", () => ({
	authQueries: {
		user: vi.fn(() => ({ queryKey: ["user"] })),
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return {
		queryClient,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	};
};

describe("useProfileActions", () => {
	it("calls updateProfileInformation and invalidates the user query on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const mockData = { displayName: "New Name", email: "new@example.com" };
		vi.mocked(updateProfileInformation).mockResolvedValue(
			{} as unknown as Awaited<ReturnType<typeof updateProfileInformation>>,
		);

		const { result } = renderHook(() => useProfileActions(), { wrapper });

		await result.current.updateProfile.mutateAsync(mockData);

		expect(updateProfileInformation).toHaveBeenCalledWith(
			mockData,
			expect.anything(),
		);
		expect(invalidateSpy).toHaveBeenCalledWith(authQueries.user());
	});

	it("calls updateAvatar and invalidates the user query on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const mockFile = new File([""], "avatar.png", { type: "image/png" });
		vi.mocked(updateAvatar).mockResolvedValue(
			{} as unknown as Awaited<ReturnType<typeof updateAvatar>>,
		);

		const { result } = renderHook(() => useProfileActions(), { wrapper });

		await result.current.updateAvatar.mutateAsync(mockFile);

		expect(updateAvatar).toHaveBeenCalledWith(mockFile, expect.anything());
		expect(invalidateSpy).toHaveBeenCalledWith(authQueries.user());
	});

	it("calls deleteAvatar and invalidates the user query on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		vi.mocked(deleteAvatar).mockResolvedValue(
			{} as unknown as Awaited<ReturnType<typeof deleteAvatar>>,
		);

		const { result } = renderHook(() => useProfileActions(), { wrapper });

		await result.current.deleteAvatar.mutateAsync();

		expect(deleteAvatar).toHaveBeenCalledWith(undefined, expect.anything());
		expect(invalidateSpy).toHaveBeenCalledWith(authQueries.user());
	});
});
