import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api/members";
import { useProjectMemberActions } from "./useProjectMemberActions";

// Mock API
vi.mock("../api/members", () => ({
	addProjectMember: vi.fn(),
	removeProjectMember: vi.fn(),
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

describe("useProjectMemberActions", () => {
	it("addMember mutation calls API and invalidates project members", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useProjectMemberActions(), { wrapper });

		vi.mocked(api.addProjectMember).mockResolvedValue({} as never);

		await result.current.addMember.mutateAsync({
			projectId: "p1",
			data: { userId: "u1" }, // ProjectMemberInput might have other fields
		});

		expect(api.addProjectMember).toHaveBeenCalledWith("p1", { userId: "u1" });
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["projects", "p1", "members"] }),
		);
	});

	it("removeMember mutation calls API and invalidates project members", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useProjectMemberActions(), { wrapper });

		vi.mocked(api.removeProjectMember).mockResolvedValue(undefined);

		await result.current.removeMember.mutateAsync({
			projectId: "p1",
			userId: "u1",
		});

		expect(api.removeProjectMember).toHaveBeenCalledWith("p1", "u1");
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["projects", "p1", "members"] }),
		);
	});
});
