import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useOrganizationTeamActions } from "@/features/organizations/hooks/useOrganizationTeamActions";
import { CreateTeamDrawer } from "./CreateTeamDrawer";

// Mock the hook
vi.mock("@/features/organizations/hooks/useOrganizationTeamActions", () => ({
	useOrganizationTeamActions: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("CreateTeamDrawer", () => {
	const mockCreateMutation = {
		mutateAsync: vi.fn().mockResolvedValue({}),
		isPending: false,
	};
	const mockOnOpenChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useOrganizationTeamActions).mockReturnValue({
			createTeam: mockCreateMutation,
		} as unknown as ReturnType<typeof useOrganizationTeamActions>);
	});

	it("renders drawer elements", () => {
		const wrapper = createWrapper();
		render(
			<CreateTeamDrawer
				organizationId="org-1"
				open={true}
				onOpenChange={mockOnOpenChange}
			/>,
			{ wrapper },
		);
		expect(screen.getByText("Create Team")).toBeInTheDocument();
		expect(screen.getByLabelText("Team Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Slug (ID)")).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		const wrapper = createWrapper();
		render(
			<CreateTeamDrawer
				organizationId="org-1"
				open={true}
				onOpenChange={mockOnOpenChange}
			/>,
			{ wrapper },
		);

		await userEvent.type(screen.getByLabelText("Team Name"), "Drawer Team");
		await userEvent.type(screen.getByLabelText("Slug (ID)"), "drawer-team");

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		await waitFor(() => {
			expect(mockCreateMutation.mutateAsync).toHaveBeenCalledWith({
				organizationId: "org-1",
				data: {
					name: "drawer-team",
					displayName: "Drawer Team",
				},
			});
		});

		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});
});
