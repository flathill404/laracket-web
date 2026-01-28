import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTeamActions } from "../hooks/useTeamActions";
import { useTeamMemberActions } from "../hooks/useTeamMemberActions";
import { TeamDetailSheet } from "./TeamDetailSheet";

// Mock hooks
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: vi.fn(),
	};
});

vi.mock("../hooks/useTeamActions", () => ({
	useTeamActions: vi.fn(),
}));

vi.mock("../hooks/useTeamMemberActions", () => ({
	useTeamMemberActions: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("../utils/queries", () => ({
	teamQueries: {
		detail: vi.fn((id: string) => ({ queryKey: ["teams", id, "detail"] })),
		members: vi.fn((id: string) => ({ queryKey: ["teams", id, "members"] })),
	},
}));

vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		teams: vi.fn((id: string) => ({
			queryKey: ["organizations", id, "teams"],
		})),
		members: vi.fn((id: string) => ({
			queryKey: ["organizations", id, "members"],
		})),
	},
}));

vi.mock("./AddTeamMemberDialog", () => ({
	AddTeamMemberDialog: vi.fn(() => <div data-testid="add-member-dialog" />),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return {
		queryClient,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	};
};

describe("TeamDetailSheet", () => {
	const mockTeam = {
		id: "team-1",
		name: "engineering",
		displayName: "Engineering",
	};
	const mockMembers = [
		{ id: "u1", name: "user1", displayName: "User One", avatarUrl: null },
	];

	const mockUpdateMutation = {
		mutate: vi.fn((_vars, options) => options?.onSuccess?.()),
	};
	const mockDeleteMutation = {
		mutate: vi.fn((_vars, options) => options?.onSuccess?.()),
	};
	const mockRemoveMemberMutation = {
		mutate: vi.fn((_vars, options) => options?.onSuccess?.()),
		isPending: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
		vi.mocked(useSuspenseQuery).mockImplementation((options: unknown) => {
			const queryKey = (options as { queryKey: string[] }).queryKey;
			if (queryKey[0] === "teams" && queryKey[2] === "detail") {
				return { data: mockTeam } as unknown as ReturnType<
					typeof useSuspenseQuery
				>;
			}
			if (queryKey[0] === "teams" && queryKey[2] === "members") {
				return { data: mockMembers } as unknown as ReturnType<
					typeof useSuspenseQuery
				>;
			}
			return { data: [] } as unknown as ReturnType<typeof useSuspenseQuery>;
		});
		vi.mocked(useTeamActions).mockReturnValue({
			update: mockUpdateMutation,
			delete: mockDeleteMutation,
		} as unknown as ReturnType<typeof useTeamActions>);
		vi.mocked(useTeamMemberActions).mockReturnValue({
			remove: mockRemoveMemberMutation,
			add: { mutate: vi.fn(), isPending: false },
		} as unknown as ReturnType<typeof useTeamMemberActions>);
	});

	it("renders team details and members", () => {
		const { wrapper } = createWrapper();
		render(
			<TeamDetailSheet
				teamId="team-1"
				organizationId="org-1"
				open={true}
				onOpenChange={vi.fn()}
			/>,
			{ wrapper },
		);

		expect(screen.getByText("Engineering")).toBeInTheDocument();
		expect(screen.getByText("@engineering")).toBeInTheDocument();
		expect(screen.getByText("User One")).toBeInTheDocument();
	});

	it("handles name update", async () => {
		const { wrapper } = createWrapper();
		render(
			<TeamDetailSheet
				teamId="team-1"
				organizationId="org-1"
				open={true}
				onOpenChange={vi.fn()}
			/>,
			{ wrapper },
		);

		await userEvent.click(screen.getByText("Engineering"));
		const input = await screen.findByDisplayValue("Engineering");
		await userEvent.clear(input);
		await userEvent.type(input, "New Name{enter}");

		expect(mockUpdateMutation.mutate).toHaveBeenCalledWith(
			expect.objectContaining({
				id: "team-1",
				data: { name: "engineering", displayName: "New Name" },
			}),
			expect.anything(),
		);
		expect(toast.success).toHaveBeenCalledWith("Team updated");
	});

	it("handles member removal", async () => {
		const { wrapper } = createWrapper();
		render(
			<TeamDetailSheet
				teamId="team-1"
				organizationId="org-1"
				open={true}
				onOpenChange={vi.fn()}
			/>,
			{ wrapper },
		);

		const removeButtons = screen.getAllByRole("button");
		// Find button with UserMinus icon (rendered as an svg)
		const removeButton = removeButtons.find((b) =>
			b.querySelector(".lucide-user-minus"),
		);
		if (removeButton) {
			await userEvent.click(removeButton);
		}

		expect(mockRemoveMemberMutation.mutate).toHaveBeenCalledWith(
			{ teamId: "team-1", userId: "u1" },
			expect.anything(),
		);
		expect(toast.success).toHaveBeenCalledWith("Member removed");
	});

	it("handles team deletion flow", async () => {
		const onOpenChange = vi.fn();
		const { wrapper } = createWrapper();
		render(
			<TeamDetailSheet
				teamId="team-1"
				organizationId="org-1"
				open={true}
				onOpenChange={onOpenChange}
			/>,
			{ wrapper },
		);

		// Open DropdownMenu
		const moreButton = screen
			.getAllByRole("button")
			.find((b) => b.getAttribute("data-slot") === "dropdown-menu-trigger");

		if (moreButton) {
			await userEvent.click(moreButton);
		}

		// Click Delete Team
		await userEvent.click(screen.getByText("Delete Team"));

		// Confirn AlertDialog
		expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: "Delete" }));

		expect(mockDeleteMutation.mutate).toHaveBeenCalledWith(
			"team-1",
			expect.anything(),
		);
		expect(toast.success).toHaveBeenCalledWith("Team deleted");
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
