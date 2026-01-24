// @vitest-environment jsdom

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createTestQueryClient } from "@/test/utils";
import { LoginForm } from "./login-form";

vi.mock("@tanstack/react-router", () => ({
	useRouter: vi.fn(),
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
	useAuth: vi.fn(),
}));

const mockUseRouter = vi.mocked(useRouter);
const mockUseAuth = vi.mocked(useAuth);

describe("LoginForm", () => {
	it("submits form correctly", async () => {
		const navigate = vi.fn();
		mockUseRouter.mockReturnValue({
			navigate,
		} as unknown as ReturnType<typeof useRouter>);
		const login = vi.fn().mockResolvedValue({ twoFactor: false });
		mockUseAuth.mockReturnValue({
			login,
		} as unknown as ReturnType<typeof useAuth>);

		const queryClient = createTestQueryClient();
		const Wrapper = ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		render(<LoginForm />, { wrapper: Wrapper });

		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "test@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Password"), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByText("Login"));

		await waitFor(() => expect(login).toHaveBeenCalled());
		await waitFor(() =>
			expect(navigate).toHaveBeenCalledWith({ to: "/dashboard" }),
		);
	});
});
