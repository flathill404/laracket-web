import { describe, expect, it, vi } from "vitest";
import { queryKeys } from "@/lib/query-keys";
import { fetchTicketActivities } from "./activities";
import { ticketActivitiesQueryOptions, ticketQueryOptions } from "./queries";
import { fetchTicket } from "./tickets";

vi.mock("./activities", () => ({
	fetchTicketActivities: vi.fn(),
}));

vi.mock("./tickets", () => ({
	fetchTicket: vi.fn(),
}));

describe("tickets queries", () => {
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
});
