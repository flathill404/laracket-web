// @vitest-environment jsdom
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useProjectActions } from "@/features/projects/hooks/useProjectActions";
import { createTestQueryClient } from "@/test/utils";
import { ProjectSettingsForm } from "./ProjectSettingsForm";

vi.mock("@/features/projects/hooks/useProjectActions", () => ({
	useProjectActions: vi.fn(),
}));

vi.mock("@/features/projects/api/projects", () => ({
	updateProject: vi.fn(),
	fetchProject: vi.fn(),
}));

const mockUseProjectActions = vi.mocked(useProjectActions);

describe("ProjectSettingsForm", () => {
	it("calls mutate on submit", async () => {
		const mutate = vi.fn();
		mockUseProjectActions.mockReturnValue({
			create: {
				mutate: vi.fn(),
				isPending: false,
			},
			update: {
				mutate,
				isPending: false,
			},
			delete: {
				mutate: vi.fn(),
				isPending: false,
			},
		} as unknown as ReturnType<typeof useProjectActions>);

		const queryClient = createTestQueryClient();
		const Wrapper = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		const project = {
			id: "p1",
			name: "Old Name",
			displayName: "Old Name",
			description: "Old Desc",
			createdAt: "",
			updatedAt: "",
		};
		render(<ProjectSettingsForm project={project} />, { wrapper: Wrapper });

		fireEvent.change(screen.getByLabelText("Project Name"), {
			target: { value: "New Name" },
		});
		fireEvent.click(screen.getByText("Save Changes"));

		await waitFor(() =>
			expect(mutate).toHaveBeenCalledWith(
				expect.objectContaining({
					id: "p1",
					data: expect.objectContaining({
						name: "New Name",
					}),
				}),
				expect.anything(),
			),
		);
	});
});
