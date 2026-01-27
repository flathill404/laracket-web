import { paginatedTicketsSchema } from "@/features/tickets/types/schemas";
import { client } from "@/lib/client";

export const fetchProjectTickets = async (
	projectId: string,
	filters?: { status?: string[]; sort?: string; cursor?: string },
) => {
	const searchParams = new URLSearchParams();
	if (filters?.status) {
		for (const s of filters.status) {
			searchParams.append("status[]", s);
		}
	}
	if (filters?.sort) {
		searchParams.append("sort", filters.sort);
	}
	if (filters?.cursor) {
		searchParams.append("cursor", filters.cursor);
	}
	const queryString = searchParams.toString();
	const url = `/projects/${projectId}/tickets${queryString ? `?${queryString}` : ""}`;

	const response = await client.get(url);
	const json = await response.json();
	return paginatedTicketsSchema.parse(json);
};
