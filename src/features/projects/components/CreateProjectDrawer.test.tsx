import type { UseMutationResult } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as hooks from "@/features/organizations/hooks/useOrganizationProjectActions";
import type { CreateOrganizationProjectInput } from "@/features/organizations/types";
import type { Project } from "@/features/projects/types";
import { CreateProjectDrawer } from "./CreateProjectDrawer";

// Mock the hook
vi.mock("@/features/organizations/hooks/useOrganizationProjectActions", () => ({
	useOrganizationProjectActions: vi.fn(),
}));

describe("CreateProjectDrawer", () => {
	const mockMutateAsync = vi.fn();
	const mockOnOpenChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		(
			hooks.useOrganizationProjectActions as MockedFunction<
				typeof hooks.useOrganizationProjectActions
			>
		).mockReturnValue({
			createProject: {
				mutateAsync: mockMutateAsync,
				isPending: false,
			} as unknown as UseMutationResult<
				Project,
				Error,
				{ organizationId: string; data: CreateOrganizationProjectInput }
			>,
		});
	});

	it("renders drawer elements", () => {
		render(
			<CreateProjectDrawer
				organizationId="org-1"
				open={true}
				onOpenChange={mockOnOpenChange}
			/>,
		);
		expect(screen.getByText("Create Project")).toBeInTheDocument();
		expect(screen.getByText("Project Name")).toBeInTheDocument();
		expect(screen.getByText("Slug (ID)")).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		render(
			<CreateProjectDrawer
				organizationId="org-1"
				open={true}
				onOpenChange={mockOnOpenChange}
			/>,
		);

		await userEvent.type(
			screen.getByPlaceholderText("My Awesome Project"),
			"Drawer Project",
		);
		await userEvent.type(
			screen.getByPlaceholderText("my-project-slug"),
			"drawer-project",
		);
		await userEvent.type(
			screen.getByPlaceholderText("Describe the project..."),
			"Drawer Desc",
		);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		await waitFor(() => {
			expect(mockMutateAsync).toHaveBeenCalledWith({
				organizationId: "org-1",
				data: {
					name: "drawer-project",
					displayName: "Drawer Project",
					description: "Drawer Desc",
				},
			});
		});

		expect(mockOnOpenChange).toHaveBeenCalledWith(false);
	});
});
