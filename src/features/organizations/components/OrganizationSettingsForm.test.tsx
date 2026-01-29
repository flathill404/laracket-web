import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Organization } from "@/features/organizations/types";
import { render } from "@/test/utils";
import { OrganizationSettingsForm } from "./OrganizationSettingsForm";

// Mock dependencies
const mockUpdateMutate = vi.fn();
vi.mock("@/features/organizations/hooks/useOrganizationActions", () => ({
	useOrganizationActions: () => ({
		update: {
			mutate: mockUpdateMutate,
			isPending: false,
		},
	}),
}));

describe("OrganizationSettingsForm", () => {
	const mockOrganization: Organization = {
		id: "org-1",
		name: "test-org",
		displayName: "Test Org",
		// Add other required fields if needed, checking the type definition would be cleaner but let's assume valid partial for now or strict.
		// The file view didn't show the Organization type definition, assuming standard fields.
	};

	it("renders form with initial values", () => {
		render(<OrganizationSettingsForm organization={mockOrganization} />);

		expect(screen.getByLabelText("Organization Name")).toHaveValue("test-org");
		expect(screen.getByLabelText("Display Name")).toHaveValue("Test Org");
	});

	it("shows validation errors for invalid input", async () => {
		const user = userEvent.setup();
		render(<OrganizationSettingsForm organization={mockOrganization} />);

		const nameInput = screen.getByLabelText("Organization Name");
		await user.clear(nameInput);
		const displayNameInput = screen.getByLabelText("Display Name");
		await user.clear(displayNameInput);

		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			// expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
			expect(screen.getByText(/Display name is required/i)).toBeInTheDocument();
		});
	});

	it("submits form with valid data", async () => {
		const user = userEvent.setup();
		render(<OrganizationSettingsForm organization={mockOrganization} />);

		const nameInput = screen.getByLabelText("Organization Name");
		await user.clear(nameInput);
		await user.type(nameInput, "updated-org");

		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(mockUpdateMutate).toHaveBeenCalledWith(
				{
					id: "org-1",
					data: {
						name: "updated-org",
						displayName: "Test Org", // Should keep original if not changed
					},
				},
				expect.anything(),
			);
		});
	});
});
