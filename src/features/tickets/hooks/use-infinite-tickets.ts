import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProjectTickets } from "@/features/projects/api/projects";
import { projectTicketsQueryKey } from "../lib/tickets";

interface UseInfiniteTicketsOptions {
	status?: string[];
	sort?: string;
}

export function useInfiniteTickets(
	projectId: string,
	options?: UseInfiniteTicketsOptions,
) {
	return useInfiniteQuery({
		queryKey: [
			...projectTicketsQueryKey(projectId),
			"infinite",
			options,
		] as const,
		queryFn: ({ pageParam }) =>
			fetchProjectTickets(projectId, {
				status: options?.status,
				sort: options?.sort,
				cursor: pageParam,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
	});
}
