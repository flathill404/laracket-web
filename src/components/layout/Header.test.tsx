import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "@/features/auth/types";
import { render } from "@/test/utils";
import { Header } from "./Header";

// Mock useNavigate
const navigateMock = vi.fn();
vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => navigateMock,
}));

// Mock UserAvatar
vi.mock("@/components/common/UserAvatar", () => ({
	UserAvatar: ({ user }: { user: User }) => (
		<div data-testid="user-avatar">{user.name}</div>
	),
}));

describe("Header", () => {
	const mockUser: User = {
		id: "1",
		name: "Test User",
		email: "test@example.com",
		avatarUrl: "https://example.com/avatar.jpg",
		twoFactorStatus: "disabled",
	} as User;

	const defaultProps = {
		user: mockUser,
		isVerified: true,
		logout: vi.fn(),
	};

	it("renders user information correctly", () => {
		render(<Header {...defaultProps} />);
		expect(screen.getByText("Laracket")).toBeInTheDocument();
		expect(screen.getByTestId("user-avatar")).toBeInTheDocument();
	});

	it("renders search bar when user is verified", () => {
		render(<Header {...defaultProps} isVerified={true} />);
		expect(
			screen.getByPlaceholderText("Search tickets..."),
		).toBeInTheDocument();
	});

	it("does not render search bar when user is not verified", () => {
		render(<Header {...defaultProps} isVerified={false} />);
		expect(
			screen.queryByPlaceholderText("Search tickets..."),
		).not.toBeInTheDocument();
	});

	it("handles search submission", async () => {
		const user = userEvent.setup();
		render(<Header {...defaultProps} />);

		const input = screen.getByPlaceholderText("Search tickets...");
		await user.type(input, "bug fix");
		fireEvent.submit(input);

		expect(navigateMock).toHaveBeenCalledWith({
			to: "/search",
			search: { q: "bug fix" },
		});
	});

	it("does not navigate on empty search", async () => {
		const user = userEvent.setup();
		render(<Header {...defaultProps} />);

		const input = screen.getByPlaceholderText("Search tickets...");
		await user.clear(input);
		fireEvent.submit(input);

		expect(navigateMock).not.toHaveBeenCalled();
	});

	it("handles logout", async () => {
		const user = userEvent.setup();
		render(<Header {...defaultProps} />);

		// Open dropdown
		await user.click(screen.getByTestId("user-avatar"));

		// Check dropdown content
		expect(screen.getAllByText("Test User")).toHaveLength(2);
		expect(screen.getByText("test@example.com")).toBeInTheDocument();

		// Click logout
		await user.click(screen.getByText("Log out"));
		expect(defaultProps.logout).toHaveBeenCalled();
	});
});
