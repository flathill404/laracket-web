import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api/comments";
import { useTicketCommentActions } from "./useTicketCommentActions";

// Mock API
vi.mock("../api/comments", () => ({
	createTicketComment: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});
	return {
		queryClient,
		wrapper: ({ children }: { children: ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		),
	};
};

describe("useTicketCommentActions", () => {
	it("create mutation calls API and invalidates comments and activities", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketCommentActions(), { wrapper });

		vi.mocked(api.createTicketComment).mockResolvedValue({} as never);

		await result.current.create.mutateAsync({
			ticketId: "t1",
			content: "Test comment",
		});

		expect(api.createTicketComment).toHaveBeenCalledWith("t1", {
			content: "Test comment",
		});
		// Invalidate comments
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1", "comments"] }),
		);
		// Invalidate activities
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1", "activities"] }),
		);
	});
});
