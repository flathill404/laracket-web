import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketActivities } from "../api/activities";
import { fetchTicket } from "../api/tickets";
import {
	projectTicketsQueryKey,
	ticketActivitiesQueryOptions,
	ticketQueryOptions,
} from "./tickets";

vi.mock("../api/activities", () => ({
	fetchTicketActivities: vi.fn(),
}));

vi.mock("../api/tickets", () => ({
	fetchTicket: vi.fn(),
}));

describe("tickets lib", () => {
	it("ticketQueryOptions generates correct options", () => {
		const ticketId = "123";
		const options = ticketQueryOptions(ticketId);
		expect(options.queryKey).toEqual(queryKeys.tickets.detail(ticketId));
		// @ts-expect-error
		options.queryFn();
		expect(fetchTicket).toHaveBeenCalledWith(ticketId);
	});

	it("ticketActivitiesQueryOptions generates correct options", () => {
		const ticketId = "123";
		const options = ticketActivitiesQueryOptions(ticketId);
		expect(options.queryKey).toEqual(queryKeys.tickets.activities(ticketId));
		// @ts-expect-error
		options.queryFn();
		expect(fetchTicketActivities).toHaveBeenCalledWith(ticketId);
	});

	it("projectTicketsQueryKey returns correct key", () => {
		const projectId = "proj-1";
		expect(projectTicketsQueryKey(projectId)).toEqual(
			queryKeys.projects.tickets(projectId),
		);
	});
});
