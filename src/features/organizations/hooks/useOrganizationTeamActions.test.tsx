import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as api from "../api";
import { organizationQueries } from "../utils/queries";
import { useOrganizationTeamActions } from "./useOrganizationTeamActions";

// Mock API functions
vi.mock("../api", () => ({
	createOrganizationTeam: vi.fn(),
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

describe("useOrganizationTeamActions", () => {
	const organizationId = "org-1";

	it("calls the API and invalidates queries when creating a team succeeds", async () => {
		const { queryClient, wrapper } = createWrapper();
		const { result } = renderHook(() => useOrganizationTeamActions(), {
			wrapper,
		});
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		(
			api.createOrganizationTeam as MockedFunction<
				typeof api.createOrganizationTeam
			>
		)
			// biome-ignore lint/suspicious/noExplicitAny: Mocking return value
			.mockResolvedValue({} as any);

		result.current.createTeam.mutate({
			organizationId,
			data: { name: "New Team", displayName: "New Team" },
		});

		await waitFor(() => expect(result.current.createTeam.isSuccess).toBe(true));

		expect(api.createOrganizationTeam).toHaveBeenCalledWith(organizationId, {
			name: "New Team",
			displayName: "New Team",
		});
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: organizationQueries.teams(organizationId).queryKey,
			}),
		);
	});
});
