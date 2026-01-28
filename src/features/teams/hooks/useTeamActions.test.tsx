import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api";
import type { Team } from "../types";
import { useTeamActions } from "./useTeamActions";

// Mock API
vi.mock("../api", () => ({
	createTeam: vi.fn(),
	updateTeam: vi.fn(),
	deleteTeam: vi.fn(),
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

describe("useTeamActions", () => {
	it("create mutation calls API and invalidates teams", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamActions(), { wrapper });

		const mockTeam = {
			id: "t1",
			name: "team1",
			displayName: "Team 1",
		} as Team;
		vi.mocked(api.createTeam).mockResolvedValue(mockTeam);

		await result.current.create.mutateAsync({
			name: "new-team",
			displayName: "New Team",
		});

		expect(api.createTeam).toHaveBeenCalledWith({
			name: "new-team",
			displayName: "New Team",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["teams"] });
	});

	it("update mutation calls API and invalidates detail and teams", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamActions(), { wrapper });

		const mockTeam = {
			id: "t1",
			name: "team1",
			displayName: "Team 1",
		} as Team;
		vi.mocked(api.updateTeam).mockResolvedValue(mockTeam);

		await result.current.update.mutateAsync({
			id: "t1",
			data: { name: "team1", displayName: "Updated Team" },
		});

		expect(api.updateTeam).toHaveBeenCalledWith("t1", {
			name: "team1",
			displayName: "Updated Team",
		});
		// Invalidate detail
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["teams", "t1"] }),
		);
		// Invalidate list
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["teams"] });
	});

	it("delete mutation calls API, removes detail and invalidates teams", async () => {
		const { queryClient, wrapper } = createWrapper();
		const removeSpy = vi.spyOn(queryClient, "removeQueries");
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTeamActions(), { wrapper });

		vi.mocked(api.deleteTeam).mockResolvedValue(undefined);

		await result.current.delete.mutateAsync("t1");

		expect(api.deleteTeam).toHaveBeenCalledWith("t1");
		expect(removeSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["teams", "t1"] }),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["teams"] });
	});
});
