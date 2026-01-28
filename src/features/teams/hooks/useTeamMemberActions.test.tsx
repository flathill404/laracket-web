import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api";
import { useTeamMemberActions } from "./useTeamMemberActions";

// Mock API
vi.mock("../api", () => ({
	addTeamMember: vi.fn(),
	updateTeamMember: vi.fn(),
	removeTeamMember: vi.fn(),
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
		wrapper: ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	};
};

describe("useTeamMemberActions", () => {
	it("add mutation calls API and invalidates team members", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamMemberActions(), { wrapper });

		vi.mocked(api.addTeamMember).mockResolvedValue({} as never);

		await result.current.add.mutateAsync({
			teamId: "t1",
			data: { userId: "u1" },
		});

		expect(api.addTeamMember).toHaveBeenCalledWith("t1", { userId: "u1" });
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["teams", "t1", "members"] }),
		);
	});

	it("update mutation calls API and invalidates team members", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamMemberActions(), { wrapper });

		vi.mocked(api.updateTeamMember).mockResolvedValue({} as never);

		await result.current.update.mutateAsync({
			teamId: "t1",
			userId: "u1",
			data: { role: "leader" },
		});

		expect(api.updateTeamMember).toHaveBeenCalledWith("t1", "u1", {
			role: "leader",
		});
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["teams", "t1", "members"] }),
		);
	});

	it("remove mutation calls API and invalidates team members", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamMemberActions(), { wrapper });

		vi.mocked(api.removeTeamMember).mockResolvedValue(undefined);

		await result.current.remove.mutateAsync({
			teamId: "t1",
			userId: "u1",
		});

		expect(api.removeTeamMember).toHaveBeenCalledWith("t1", "u1");
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["teams", "t1", "members"] }),
		);
	});
});
