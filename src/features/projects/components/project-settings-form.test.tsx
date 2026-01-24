// @vitest-environment jsdom

import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMutationWithToast } from "@/hooks/use-mutation-with-toast";
import { createTestQueryClient } from "@/test/utils";
import { ProjectSettingsForm } from "./project-settings-form";

vi.mock("@/hooks/use-mutation-with-toast", () => ({
	useMutationWithToast: vi.fn(),
}));

vi.mock("@/features/projects/api/projects", () => ({
	updateProject: vi.fn(),
	fetchProject: vi.fn(),
}));

describe("ProjectSettingsForm", () => {
	it("calls mutate on submit", async () => {
		const mutate = vi.fn();
		(useMutationWithToast as any).mockReturnValue({ mutate, isPending: false });

		const queryClient = createTestQueryClient();
		const Wrapper = ({ children }: any) => (
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
					name: "New Name",
				}),
			),
		);
	});
});
