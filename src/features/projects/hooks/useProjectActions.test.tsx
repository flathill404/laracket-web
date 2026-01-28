import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api/projects";
import type { Project } from "../types";
import { useProjectActions } from "./useProjectActions";

// Mock API
vi.mock("../api/projects", () => ({
	createProject: vi.fn(),
	updateProject: vi.fn(),
	deleteProject: vi.fn(),
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

describe("useProjectActions", () => {
	it("create mutation calls API and invalidates projects", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useProjectActions(), { wrapper });

		const mockProject = {
			id: "p1",
			name: "p1",
			displayName: "P1",
		} as Project;
		vi.mocked(api.createProject).mockResolvedValue(mockProject);

		await result.current.create.mutateAsync({
			name: "new-proj",
			displayName: "New Project",
		});

		expect(api.createProject).toHaveBeenCalledWith({
			name: "new-proj",
			displayName: "New Project",
		});
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["projects"] });
	});

	it("update mutation calls API and invalidates detail and projects", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useProjectActions(), { wrapper });

		const mockProject = {
			id: "p1",
			name: "p1",
			displayName: "P1",
		} as Project;
		vi.mocked(api.updateProject).mockResolvedValue(mockProject);

		await result.current.update.mutateAsync({
			id: "p1",
			data: { displayName: "Updated Project" },
		});

		expect(api.updateProject).toHaveBeenCalledWith("p1", {
			displayName: "Updated Project",
		});
		// Invalidate detail
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["projects", "p1"] }),
		);
		// Invalidate list
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["projects"] });
	});

	it("delete mutation calls API, removes detail and invalidates projects", async () => {
		const { queryClient, wrapper } = createWrapper();
		const removeSpy = vi.spyOn(queryClient, "removeQueries");
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useProjectActions(), { wrapper });

		vi.mocked(api.deleteProject).mockResolvedValue(undefined);

		await result.current.delete.mutateAsync("p1");

		expect(api.deleteProject).toHaveBeenCalledWith("p1");
		expect(removeSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["projects", "p1"] }),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["projects"] });
	});
});
