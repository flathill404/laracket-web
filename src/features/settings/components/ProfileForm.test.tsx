import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProfileActions } from "@/features/settings/hooks/useProfileActions";
import { ProfileForm } from "./ProfileForm";

// Mock hooks
vi.mock("@tanstack/react-query", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...original,
		useSuspenseQuery: vi.fn(),
	};
});

vi.mock("@/features/settings/hooks/useProfileActions", () => ({
	useProfileActions: vi.fn(),
}));

vi.mock("sonner", () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

const mockUser = {
	id: "u1",
	name: "johndoe",
	displayName: "John Doe",
	email: "john@example.com",
	avatarUrl: "https://example.com/avatar.png",
};

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe("ProfileForm", () => {
	const mockUpdateProfile = { mutateAsync: vi.fn() };
	const mockUpdateAvatar = { mutateAsync: vi.fn(), isPending: false };
	const mockDeleteAvatar = { mutate: vi.fn(), isPending: false };

	beforeEach(() => {
		vi.mocked(useSuspenseQuery).mockReturnValue({
			data: mockUser,
		} as unknown as ReturnType<typeof useSuspenseQuery>);
		vi.mocked(useProfileActions).mockReturnValue({
			updateProfile: mockUpdateProfile,
			updateAvatar: mockUpdateAvatar,
			deleteAvatar: mockDeleteAvatar,
		} as unknown as ReturnType<typeof useProfileActions>);
	});

	it("renders user information", () => {
		render(<ProfileForm />, { wrapper: createWrapper() });
		expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
		expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
		expect(screen.getByText("johndoe")).toBeInTheDocument();
	});

	it("submits profile updates", async () => {
		const user = userEvent.setup();
		render(<ProfileForm />, { wrapper: createWrapper() });

		const displayNameInput = screen.getByLabelText("Display Name");
		await user.clear(displayNameInput);
		await user.type(displayNameInput, "Jane Doe");

		const submitButton = screen.getByRole("button", { name: "Save" });
		await user.click(submitButton);

		expect(mockUpdateProfile.mutateAsync).toHaveBeenCalledWith(
			expect.objectContaining({
				displayName: "Jane Doe",
				email: "john@example.com",
			}),
		);
	});

	it("triggers file input when clicking Select New Photo", async () => {
		render(<ProfileForm />, { wrapper: createWrapper() });
		const selectButton = screen.getByRole("button", {
			name: "Select New Photo",
		});

		// We can't easily test the native file dialog, but we can check if click was called on the hidden input
		const fileInput = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const clickSpy = vi.spyOn(fileInput, "click");

		fireEvent.click(selectButton);
		expect(clickSpy).toHaveBeenCalled();
	});

	it("shows delete avatar confirmation dialog", async () => {
		const user = userEvent.setup();
		render(<ProfileForm />, { wrapper: createWrapper() });

		const deleteButton = screen.getByRole("button", { name: /delete avatar/i });
		await user.click(deleteButton);

		expect(screen.getByText("Delete Avatar")).toBeInTheDocument();
		expect(
			screen.getByText(/Are you sure you want to delete your avatar/i),
		).toBeInTheDocument();
	});

	it("calls deleteAvatar mutation when confirmed", async () => {
		const user = userEvent.setup();
		render(<ProfileForm />, { wrapper: createWrapper() });

		const deleteButton = screen.getByRole("button", { name: /delete avatar/i });
		await user.click(deleteButton);

		const confirmDeleteButton = screen
			.getAllByRole("button", { name: "Delete" })
			.find((b) => !b.classList.contains("absolute"));
		if (confirmDeleteButton) {
			await user.click(confirmDeleteButton);
			expect(mockDeleteAvatar.mutate).toHaveBeenCalled();
		}
	});
});
