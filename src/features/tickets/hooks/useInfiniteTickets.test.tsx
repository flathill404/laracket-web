// @vitest-environment jsdom
import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchProjectTickets } from "@/features/projects/api/projects";
import { createTestQueryClient } from "@/test/utils";
import { useInfiniteTickets } from "./useInfiniteTickets";

vi.mock("@/features/projects/api/projects", () => ({
	fetchProjectTickets: vi.fn(),
}));

const mockFetchProjectTickets = vi.mocked(fetchProjectTickets);

describe("useInfiniteTickets", () => {
	it("fetches tickets with correct params", async () => {
		const queryClient = createTestQueryClient();
		const wrapper = ({ children }: { children: React.ReactNode }) => (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);

		mockFetchProjectTickets.mockResolvedValue({
			data: [],
			meta: { nextCursor: "next-page" },
		} as unknown as Awaited<ReturnType<typeof fetchProjectTickets>>);

		const { result } = renderHook(
			() => useInfiniteTickets("proj-1", { status: ["open"], sort: "newest" }),
			{ wrapper },
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(fetchProjectTickets).toHaveBeenCalledWith("proj-1", {
			status: ["open"],
			sort: "newest",
			cursor: undefined,
		});

		// Test load more
		await result.current.fetchNextPage();

		await waitFor(() => expect(fetchProjectTickets).toHaveBeenCalledTimes(2));
		expect(fetchProjectTickets).toHaveBeenCalledWith("proj-1", {
			status: ["open"],
			sort: "newest",
			cursor: "next-page",
		});
	});
});
