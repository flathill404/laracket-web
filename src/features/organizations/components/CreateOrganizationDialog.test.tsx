import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@/test/utils";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
	useRouter: () => ({
		navigate: mockNavigate,
	}),
}));

const mockCreateMutate = vi.fn();
vi.mock("@/features/organizations/hooks/useOrganizationActions", () => ({
	useOrganizationActions: () => ({
		create: {
			mutate: mockCreateMutate,
			isPending: false,
		},
	}),
}));

describe("CreateOrganizationDialog", () => {
	it("renders dialog trigger and content", async () => {
		const user = userEvent.setup();
		render(
			<CreateOrganizationDialog
				trigger={<button type="button">Open Dialog</button>}
			/>,
		);

		const trigger = screen.getByText("Open Dialog");
		await user.click(trigger);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Create Organization" }),
		).toBeInTheDocument();
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
	});

	it("shows validation errors for invalid input", async () => {
		const user = userEvent.setup();
		render(
			<CreateOrganizationDialog
				trigger={<button type="button">Open Dialog</button>}
			/>,
		);

		await user.click(screen.getByText("Open Dialog"));

		// Submit empty form
		await user.click(
			screen.getByRole("button", { name: "Create Organization" }),
		);

		await waitFor(() => {
			// expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
			expect(screen.getByText(/Display name is required/i)).toBeInTheDocument();
		});
	});

	it("submits form with valid data", async () => {
		const user = userEvent.setup();

		// Mock successful mutation
		mockCreateMutate.mockImplementation((_data, options) => {
			options.onSuccess({ id: "org-1", displayName: "New Org" });
		});

		render(
			<CreateOrganizationDialog
				trigger={<button type="button">Open Dialog</button>}
			/>,
		);

		await user.click(screen.getByText("Open Dialog"));

		await user.type(screen.getByLabelText("Name"), "new-org");
		await user.type(screen.getByLabelText("Display Name"), "New Org");

		await user.click(
			screen.getByRole("button", { name: "Create Organization" }),
		);

		await waitFor(() => {
			expect(mockCreateMutate).toHaveBeenCalledWith(
				{ name: "new-org", displayName: "New Org" },
				expect.anything(),
			);
			expect(mockNavigate).toHaveBeenCalledWith({
				to: "/organizations/$organizationId/overview",
				params: { organizationId: "org-1" },
			});
		});
	});
});
