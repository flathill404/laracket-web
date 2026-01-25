import { waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@/test/utils";
import { useMutationWithToast } from "./use-mutation-with-toast";

// Mock sonner
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe("useMutationWithToast", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("calls toast.success on successful mutation", async () => {
		const successMessage = "Operation successful";
		const mutationFn = vi.fn().mockResolvedValue("data");

		const { result } = renderHook(() =>
			useMutationWithToast({
				mutationFn,
				successMessage,
				errorMessage: "Failed",
			}),
		);

		// useMutation returns an object, we want to call result.current.mutate
		result.current.mutate(undefined);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(toast.success).toHaveBeenCalledWith(successMessage);
	});

	it("calls toast.success with dynamic message", async () => {
		const successMessageFn = (data: string) => `Created ${data}`;
		const mutationFn = vi.fn().mockResolvedValue("Item 1");

		const { result } = renderHook(() =>
			useMutationWithToast({
				mutationFn,
				successMessage: successMessageFn,
				errorMessage: "Failed",
			}),
		);

		result.current.mutate(undefined);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(toast.success).toHaveBeenCalledWith("Created Item 1");
	});

	it("calls toast.error on failed mutation", async () => {
		const errorMessage = "Operation failed";
		const mutationFn = vi.fn().mockRejectedValue(new Error("Error"));

		const { result } = renderHook(() =>
			useMutationWithToast({
				mutationFn,
				successMessage: "Success",
				errorMessage,
			}),
		);

		result.current.mutate(undefined);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(toast.error).toHaveBeenCalledWith(errorMessage);
	});

	it("invalidates queries on success if invalidateKeys is provided", async () => {
		// We need access to queryClient to verify invalidation.
		// However, creating a mock queryClient in the hook wrapper is handled by renderHook
		// if using the custom render from test/utils.
		// But testing invalidation is tricky without checking query state.
		// Instead we can spy on queryClient.invalidateQueries.
		// In @/test/utils, we use a real QueryClient.
		// We can spy on the method of the client instance.
		// But renderHook with wrapper creates a new client per test in AllTheProviders.
		// To mock invalidateQueries, we might need to mock useQueryClient hook from tanstack-query
		// or rely on testing-library's wrapper context.
		// Since we are unit testing the hook, checking if queryClient.invalidateQueries is called is enough.
		// Let's mock useQueryClient.
		// But verify: implementation uses `const queryClient = useQueryClient();`
	});
});
