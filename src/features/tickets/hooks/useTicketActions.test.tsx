import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as api from "../api/tickets";
import type { Ticket } from "../types";
import { useTicketActions } from "./useTicketActions";

// Mock API
vi.mock("../api/tickets", () => ({
	createTicket: vi.fn(),
	updateTicket: vi.fn(),
	updateTicketStatus: vi.fn(),
	deleteTicket: vi.fn(),
	addTicketAssignee: vi.fn(),
	removeTicketAssignee: vi.fn(),
	addTicketReviewer: vi.fn(),
	removeTicketReviewer: vi.fn(),
	updateTicketOrder: vi.fn(),
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

describe("useTicketActions", () => {
	const mockTicket: Ticket = {
		id: "t1",
		title: "Test Ticket",
		status: "open",
		projectId: "p1",
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
	} as Ticket;

	it("create mutation calls API and invalidates project tickets", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.createTicket).mockResolvedValue(mockTicket);

		await result.current.create.mutateAsync({
			title: "New Ticket",
		});

		expect(api.createTicket).toHaveBeenCalledWith(
			{
				title: "New Ticket",
			},
			expect.anything(),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["projects", "p1", "tickets"],
		});
	});

	it("update mutation calls API and invalidates detail and project tickets", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.updateTicket).mockResolvedValue(mockTicket);

		await result.current.update.mutateAsync({
			id: "t1",
			data: { title: "Updated Title" },
		});

		expect(api.updateTicket).toHaveBeenCalledWith("t1", {
			title: "Updated Title",
		});
		// Invalidate detail
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
		// Invalidate project tickets
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["projects", "p1", "tickets"],
		});
	});

	it("updateStatus mutation calls API and invalidates detail and all tickets", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.updateTicketStatus).mockResolvedValue(undefined);

		await result.current.updateStatus.mutateAsync({
			id: "t1",
			status: "in_progress",
		});

		expect(api.updateTicketStatus).toHaveBeenCalledWith("t1", {
			status: "in_progress",
		});
		// Invalidate detail
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
		// Invalidate all tickets
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["tickets"],
		});
	});

	it("delete mutation calls API, removes detail and invalidates project tickets", async () => {
		const { queryClient, wrapper } = createWrapper();
		const removeSpy = vi.spyOn(queryClient, "removeQueries");
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.deleteTicket).mockResolvedValue(undefined);

		await result.current.delete.mutateAsync({ id: "t1", projectId: "p1" });

		expect(api.deleteTicket).toHaveBeenCalledWith("t1");
		expect(removeSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["projects", "p1", "tickets"],
		});
	});

	it("addAssignee mutation calls API and invalidates ticket detail", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.addTicketAssignee).mockResolvedValue({} as never);

		await result.current.addAssignee.mutateAsync({
			id: "t1",
			data: { userId: "u1" },
		});

		expect(api.addTicketAssignee).toHaveBeenCalledWith("t1", { userId: "u1" });
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
	});

	it("removeAssignee mutation calls API and invalidates ticket detail", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.removeTicketAssignee).mockResolvedValue(undefined);

		await result.current.removeAssignee.mutateAsync({
			id: "t1",
			userId: "u1",
		});

		expect(api.removeTicketAssignee).toHaveBeenCalledWith("t1", "u1");
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
	});

	it("addReviewer mutation calls API and invalidates ticket detail", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.addTicketReviewer).mockResolvedValue({} as never);

		await result.current.addReviewer.mutateAsync({
			id: "t1",
			data: { userId: "u1" },
		});

		expect(api.addTicketReviewer).toHaveBeenCalledWith("t1", { userId: "u1" });
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
	});

	it("removeReviewer mutation calls API and invalidates ticket detail", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.removeTicketReviewer).mockResolvedValue(undefined);

		await result.current.removeReviewer.mutateAsync({
			id: "t1",
			userId: "u1",
		});

		expect(api.removeTicketReviewer).toHaveBeenCalledWith("t1", "u1");
		expect(invalidateSpy).toHaveBeenCalledWith(
			expect.objectContaining({ queryKey: ["tickets", "t1"] }),
		);
	});

	it("updateOrder mutation calls API and invalidates project tickets", async () => {
		const { queryClient, wrapper } = createWrapper();
		const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
		const { result } = renderHook(() => useTicketActions(), { wrapper });

		vi.mocked(api.updateTicketOrder).mockResolvedValue(undefined);

		await result.current.updateOrder.mutateAsync({
			id: "t1",
			data: { order: 1 },
			projectId: "p1",
		});

		expect(api.updateTicketOrder).toHaveBeenCalledWith("t1", {
			order: 1,
		});
		expect(invalidateSpy).toHaveBeenCalledWith({
			queryKey: ["projects", "p1", "tickets"],
		});
	});
});
