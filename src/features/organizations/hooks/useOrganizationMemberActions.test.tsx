import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as api from "../api";
import { organizationQueries } from "../utils/queries";
import { useOrganizationMemberActions } from "./useOrganizationMemberActions";

// Mock API functions
vi.mock("../api", () => ({
	addOrganizationMember: vi.fn(),
	updateOrganizationMember: vi.fn(),
	removeOrganizationMember: vi.fn(),
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

describe("useOrganizationMemberActions", () => {
	const organizationId = "org-1";
	const userId = "user-1";

	it("addMember calls api and invalidates queries on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const { result } = renderHook(() => useOrganizationMemberActions(), {
			wrapper,
		});
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		(
			api.addOrganizationMember as MockedFunction<
				typeof api.addOrganizationMember
			>
		)
			// biome-ignore lint/suspicious/noExplicitAny: Mocking return value
			.mockResolvedValue({} as any);

		result.current.addMember.mutate({
			organizationId,
			data: { userId: "user-2" },
		});

		await waitFor(() => expect(result.current.addMember.isSuccess).toBe(true));

		expect(api.addOrganizationMember).toHaveBeenCalledWith(organizationId, {
			userId: "user-2",
		});
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: organizationQueries.members(organizationId).queryKey,
			}),
		);
	});

	it("updateMember calls api and invalidates queries on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const { result } = renderHook(() => useOrganizationMemberActions(), {
			wrapper,
		});
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		(
			api.updateOrganizationMember as MockedFunction<
				typeof api.updateOrganizationMember
			>
		)
			// biome-ignore lint/suspicious/noExplicitAny: Mocking return value
			.mockResolvedValue({} as any);

		result.current.updateMember.mutate({
			organizationId,
			userId,
			data: { role: "admin" },
		});

		await waitFor(() =>
			expect(result.current.updateMember.isSuccess).toBe(true),
		);

		expect(api.updateOrganizationMember).toHaveBeenCalledWith(
			organizationId,
			userId,
			{ role: "admin" },
		);
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: organizationQueries.members(organizationId).queryKey,
			}),
		);
	});

	it("removeMember calls api and invalidates queries on success", async () => {
		const { queryClient, wrapper } = createWrapper();
		const { result } = renderHook(() => useOrganizationMemberActions(), {
			wrapper,
		});
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

		(
			api.removeOrganizationMember as MockedFunction<
				typeof api.removeOrganizationMember
			>
		)
			// biome-ignore lint/suspicious/noExplicitAny: Mocking return value
			.mockResolvedValue({} as any);

		result.current.removeMember.mutate({
			organizationId,
			userId,
		});

		await waitFor(() =>
			expect(result.current.removeMember.isSuccess).toBe(true),
		);

		expect(api.removeOrganizationMember).toHaveBeenCalledWith(
			organizationId,
			userId,
		);
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				queryKey: organizationQueries.members(organizationId).queryKey,
			}),
		);
	});
});
