import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as api from "../api";
import { organizationQueries } from "../utils/queries";
import { useOrganizationProjectActions } from "./useOrganizationProjectActions";

// Mock API functions
vi.mock("../api", () => ({
	createOrganizationProject: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});
	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return { queryClient, wrapper };
};

describe("useOrganizationProjectActions", () => {
	const organizationId = "org-1";

	it("calls the API and invalidates queries when creating a project succeeds", async () => {
		const { queryClient, wrapper } = createWrapper();
		const { result } = renderHook(() => useOrganizationProjectActions(), {
			wrapper,
		});
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		(
			api.createOrganizationProject as MockedFunction<
				typeof api.createOrganizationProject
			>
		)
			// biome-ignore lint/suspicious/noExplicitAny: Mocking return value
			.mockResolvedValue({} as any);

		result.current.createProject.mutate({
			organizationId,
			data: {
				name: "New Project",
				displayName: "New Project Display",
				description: "Desc",
			},
		});

		await waitFor(() =>
			expect(result.current.createProject.isSuccess).toBe(true),
		);

		expect(api.createOrganizationProject).toHaveBeenCalledWith(organizationId, {
			name: "New Project",
			displayName: "New Project Display",
			description: "Desc",
		});
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: organizationQueries.projects(organizationId).queryKey,
			}),
		);
	});
});
