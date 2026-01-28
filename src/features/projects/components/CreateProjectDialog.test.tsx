import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as api from "../api/projects";
import { CreateProjectDialog } from "./CreateProjectDialog";

// Mock API
vi.mock("../api/projects", () => ({
	createProject: vi.fn(),
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
	return {
		queryClient,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	};
};

describe("CreateProjectDialog", () => {
	it("renders trigger button and opens dialog", async () => {
		const { wrapper } = createWrapper();
		render(
			<CreateProjectDialog trigger={<button type="button">Open</button>} />,
			{
				wrapper,
			},
		);

		const trigger = screen.getByText("Open");
		await userEvent.click(trigger);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: /create project/i }),
		).toBeInTheDocument();
	});

	it("submits form with valid data", async () => {
		const { wrapper } = createWrapper();
		render(<CreateProjectDialog open={true} onOpenChange={() => {}} />, {
			wrapper,
		});

		(
			api.createProject as MockedFunction<typeof api.createProject>
		).mockResolvedValue({
			id: "proj-1",
			name: "test-project",
			displayName: "Test Project",
			description: "Test Desc",
			createdAt: "",
			updatedAt: "",
		});

		await userEvent.type(
			screen.getByPlaceholderText("e.g. Laracket Web"),
			"Test Project",
		);
		await userEvent.type(
			screen.getByPlaceholderText("e.g. laracket-web"),
			"test-project",
		);
		await userEvent.type(
			screen.getByPlaceholderText("Project description..."),
			"Test Desc",
		);

		await userEvent.click(
			screen.getByRole("button", { name: "Create Project" }),
		);

		await waitFor(() => {
			expect(api.createProject).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "test-project",
					displayName: "Test Project",
					description: "Test Desc",
				}),
				expect.anything(),
			);
		});

		expect(toast.success).toHaveBeenCalled();
		expect(navigateMock).toHaveBeenCalledWith({
			to: "/projects/$projectId/tickets",
			params: { projectId: "proj-1" },
		});
	});

	it("validates required fields", async () => {
		const { wrapper } = createWrapper();
		render(<CreateProjectDialog open={true} onOpenChange={() => {}} />, {
			wrapper,
		});

		// Submit empty form
		await userEvent.click(
			screen.getByRole("button", { name: "Create Project" }),
		);

		// Check for validation errors (HTML5 validation or Zod errors rendered)
		// Since useAppForm handles validation, we expect errors.
		// The implementation uses sonner toast or field errors?
		// Component uses FieldGroup/InputField which display errors.

		// Wait for potential async validation
		// Zod schema messages: "Name is required", "Slug is required"
		await waitFor(() => {
			expect(screen.getByText("Name is required")).toBeInTheDocument();
			expect(screen.getByText("Slug is required")).toBeInTheDocument();
		});

		expect(api.createProject).not.toHaveBeenCalled();
	});
});
