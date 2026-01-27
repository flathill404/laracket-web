import { paginatedTicketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";

export type FetchTicketsOptions = {
	filters?: { status?: string[] };
	sort?: string;
	pagination?: { cursor?: string };
};

export const fetchProjectTickets = async (
	projectId: string,
	options?: FetchTicketsOptions,
) => {
	const searchParams = new URLSearchParams();
	if (options?.filters?.status) {
		for (const s of options.filters.status) {
			searchParams.append("status[]", s);
		}
	}
	if (options?.sort) {
		searchParams.append("sort", options.sort);
	}
	if (options?.pagination?.cursor) {
		searchParams.append("cursor", options.pagination.cursor);
	}
	const queryString = searchParams.toString();
	const url = `/projects/${projectId}/tickets${queryString ? `?${queryString}` : ""}`;

	const response = await client.get(url);
	const json = await response.json();
	return paginatedTicketsSchema.parse(json);
};
