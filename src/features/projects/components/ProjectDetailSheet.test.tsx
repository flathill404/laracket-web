import {
	QueryClient,
	QueryClientProvider,
	type UseMutationResult,
	type UseSuspenseQueryResult,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, type MockedFunction, vi } from "vitest";
import * as hooks from "@/features/projects/hooks/useProjectActions";
import * as queryUtils from "@/features/projects/utils/queries";
import type { Project, UpdateProjectInput } from "../types";
import { ProjectDetailSheet } from "./ProjectDetailSheet";

// Mock hooks and queries
vi.mock("@/features/projects/hooks/useProjectActions", () => ({
	useProjectActions: vi.fn(),
}));

vi.mock("@/features/projects/utils/queries", () => ({
	projectQueries: {
		detail: vi.fn(),
	},
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useSuspenseQuery: vi.fn(),
	};
});

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

describe("ProjectDetailSheet", () => {
	const mockProject = {
		id: "proj-1",
		name: "Test Project",
		description: "Test Description",
		createdAt: "2023-01-01T00:00:00Z",
		updatedAt: "2023-01-02T00:00:00Z",
	};

	const mockUpdate = { mutate: vi.fn() } as unknown as UseMutationResult<
		Project,
		Error,
		{ id: string; data: UpdateProjectInput }
	>;
	const mockDelete = { mutate: vi.fn() } as unknown as UseMutationResult<
		void,
		Error,
		string
	>;

	beforeEach(() => {
		vi.clearAllMocks();
		(
			useSuspenseQuery as MockedFunction<typeof useSuspenseQuery>
		).mockReturnValue({
			data: mockProject,
		} as unknown as UseSuspenseQueryResult<Project, Error>);
		(
			hooks.useProjectActions as MockedFunction<typeof hooks.useProjectActions>
		).mockReturnValue({
			update: mockUpdate,
			delete: mockDelete,
		} as ReturnType<typeof hooks.useProjectActions>);
		(
			queryUtils.projectQueries.detail as MockedFunction<
				typeof queryUtils.projectQueries.detail
			>
		).mockReturnValue({
			queryKey: ["projects", "proj-1"] as const,
		} as unknown as ReturnType<typeof queryUtils.projectQueries.detail>);
	});

	it("renders project details", () => {
		const { wrapper } = createWrapper();
		render(
			<ProjectDetailSheet
				projectId="proj-1"
				open={true}
				onOpenChange={() => {}}
			/>,
			{ wrapper },
		);

		expect(screen.getByText("Test Project")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
		expect(screen.getByText("proj-1")).toBeInTheDocument();
	});

	it("enables name editing on click", async () => {
		const { wrapper } = createWrapper();
		render(
			<ProjectDetailSheet
				projectId="proj-1"
				open={true}
				onOpenChange={() => {}}
			/>,
			{ wrapper },
		);

		await userEvent.click(screen.getByText("Test Project"));
		const input = screen.getByDisplayValue("Test Project");
		expect(input).toBeInTheDocument();
		expect(input).toHaveFocus();

		await userEvent.clear(input);
		await userEvent.type(input, "Updated Name");
		await userEvent.tab(); // Trigger blur

		await waitFor(() => {
			expect(mockUpdate.mutate).toHaveBeenCalledWith(
				{ id: "proj-1", data: { name: "Updated Name" } },
				expect.anything(),
			);
		});
	});

	it("enables description editing", async () => {
		const { wrapper } = createWrapper();
		render(
			<ProjectDetailSheet
				projectId="proj-1"
				open={true}
				onOpenChange={() => {}}
			/>,
			{ wrapper },
		);

		const textarea = screen.getByPlaceholderText("Add a description...");
		await userEvent.clear(textarea);
		await userEvent.type(textarea, "New Desc");
		await userEvent.tab(); // Trigger blur

		await waitFor(() => {
			expect(mockUpdate.mutate).toHaveBeenCalledWith(
				{ id: "proj-1", data: { description: "New Desc" } },
				expect.anything(),
			);
		});
	});

	it("handles delete flow", async () => {
		const { wrapper } = createWrapper();
		render(
			<ProjectDetailSheet
				projectId="proj-1"
				open={true}
				onOpenChange={() => {}}
			/>,
			{ wrapper },
		);

		// Open menu
		await userEvent.click(screen.getByRole("button", { name: /open menu/i }));

		// Click delete option
		await userEvent.click(screen.getByText("Delete Project"));

		// Confirm dialog
		expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
		await userEvent.click(screen.getByRole("button", { name: "Delete" }));

		await waitFor(() => {
			expect(mockDelete.mutate).toHaveBeenCalledWith(
				"proj-1",
				expect.anything(),
			);
		});
	});
});
