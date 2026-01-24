// @vitest-environment jsdom

import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { createTestQueryClient } from "@/test/utils";
import { LoginForm } from "./login-form";

vi.mock("@tanstack/react-router", () => ({
	useRouter: vi.fn(),
	Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

vi.mock("@/features/auth/hooks/use-auth", () => ({
	useAuth: vi.fn(),
}));

describe("LoginForm", () => {
	it("submits form correctly", async () => {
		const navigate = vi.fn();
		(useRouter as any).mockReturnValue({ navigate });
		const login = vi.fn().mockResolvedValue({ twoFactor: false });
		(useAuth as any).mockReturnValue({ login });

		const queryClient = createTestQueryClient();
		const Wrapper = ({ children }: any) => (
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
