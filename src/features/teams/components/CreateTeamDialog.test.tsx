import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import * as api from "../api";
import { CreateTeamDialog } from "./CreateTeamDialog";

// Mock API
vi.mock("../api", () => ({
	createTeam: vi.fn(),
}));

// Mock Router
const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		navigate: navigateMock,
	}),
}));

// Mock Toast
vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("CreateTeamDialog", () => {
	it("renders and submits with valid data", async () => {
		const wrapper = createWrapper();
		vi.mocked(api.createTeam).mockResolvedValue({
			id: "team-1",
			name: "new-team",
			displayName: "New Team",
		} as unknown as Awaited<ReturnType<typeof api.createTeam>>);

		render(<CreateTeamDialog open={true} onOpenChange={vi.fn()} />, {
			wrapper,
		});

		const nameInput = await screen.findByLabelText("Name");
		const displayNameInput = await screen.findByLabelText("Display Name");

		await userEvent.clear(nameInput);
		await userEvent.type(nameInput, "new-team");
		await userEvent.tab();

		await userEvent.clear(displayNameInput);
		await userEvent.type(displayNameInput, "New Team");
		await userEvent.tab();

		const submitButton = screen.getByRole("button", { name: "Create Team" });
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(api.createTeam).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "new-team",
					displayName: "New Team",
				}),
				expect.anything(),
			);
		});

		expect(toast.success).toHaveBeenCalled();
		expect(navigateMock).toHaveBeenCalledWith({
			to: "/teams/$teamId/tickets",
			params: { teamId: "team-1" },
		});
	});

	it("shows validation error for invalid slug", async () => {
		const wrapper = createWrapper();
		render(<CreateTeamDialog open={true} onOpenChange={vi.fn()} />, {
			wrapper,
		});

		const nameInput = await screen.findByLabelText("Name");
		await userEvent.type(nameInput, "Invalid Name!");

		const submitButton = screen.getByRole("button", { name: "Create Team" });
		await userEvent.click(submitButton);

		// Check for the validation error - it may contain multiple errors
		const errorMessage = await screen.findByTestId("error-name");
		expect(errorMessage).toHaveTextContent(
			/Name can only contain letters, numbers, dashes, and underscores/,
		);
	});
});
