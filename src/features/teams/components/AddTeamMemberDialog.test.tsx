import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTeamMemberActions } from "../hooks/useTeamMemberActions";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";

// Mock hooks
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: vi.fn(),
	};
});

vi.mock("../hooks/useTeamMemberActions", () => ({
	useTeamMemberActions: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock("@/features/organizations/utils/queries", () => ({
	organizationQueries: {
		members: vi.fn((id: string) => ({
			queryKey: ["organizations", id, "members"],
		})),
	},
}));

vi.mock("../utils/queries", () => ({
	teamQueries: {
		members: vi.fn((id: string) => ({ queryKey: ["teams", id, "members"] })),
	},
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

describe("AddTeamMemberDialog", () => {
	const mockOrgMembers = [
		{ id: "u1", name: "user1", displayName: "User One", avatarUrl: null },
		{ id: "u2", name: "user2", displayName: "User Two", avatarUrl: null },
	];
	const mockTeamMembers = [
		{ id: "u1", name: "user1", displayName: "User One", avatarUrl: null },
	];

	const mockAddMutation = {
		mutate: vi.fn((_vars, options) => options?.onSuccess?.()),
		isPending: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		window.HTMLElement.prototype.scrollIntoView = vi.fn();
		vi.mocked(useSuspenseQuery).mockImplementation((options) => {
			const queryOptions = options as { queryKey: string[] };
			if (
				queryOptions.queryKey[0] === "organizations" &&
				queryOptions.queryKey[2] === "members"
			) {
				return { data: mockOrgMembers } as ReturnType<typeof useSuspenseQuery>;
			}
			if (
				queryOptions.queryKey[0] === "teams" &&
				queryOptions.queryKey[2] === "members"
			) {
				return { data: mockTeamMembers } as ReturnType<typeof useSuspenseQuery>;
			}
			return { data: [] } as ReturnType<typeof useSuspenseQuery>;
		});
		vi.mocked(useTeamMemberActions).mockReturnValue({
			add: mockAddMutation,
		} as unknown as ReturnType<typeof useTeamMemberActions>);
	});

	it("renders and filters out existing members", async () => {
		const { wrapper } = createWrapper();
		render(
			<AddTeamMemberDialog
				organizationId="org-1"
				teamId="team-1"
				open={true}
				onOpenChange={vi.fn()}
			/>,
			{ wrapper },
		);

		const trigger = screen.getByRole("combobox");
		await userEvent.click(trigger);

		// User One is already in the team, so only User Two should be available in list
		// Command/Select might render items in a portal, but cmdk usually handles it.
		expect(screen.queryByText("User One")).not.toBeInTheDocument();
		expect(screen.getByText("User Two")).toBeInTheDocument();
	});

	it("submits the form when a member is selected", async () => {
		const onOpenChange = vi.fn();
		const { wrapper } = createWrapper();
		render(
			<AddTeamMemberDialog
				organizationId="org-1"
				teamId="team-1"
				open={true}
				onOpenChange={onOpenChange}
			/>,
			{ wrapper },
		);

		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.click(screen.getByText("User Two"));

		const addButton = screen.getByRole("button", { name: "Add Member" });
		await userEvent.click(addButton);

		expect(mockAddMutation.mutate).toHaveBeenCalledWith(
			{ teamId: "team-1", data: { userId: "u2" } },
			expect.anything(),
		);
		expect(toast.success).toHaveBeenCalledWith("Member added");
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
