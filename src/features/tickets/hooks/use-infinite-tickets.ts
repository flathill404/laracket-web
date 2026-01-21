import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProjectTickets } from "@/features/projects/api/projects";

interface UseInfiniteTicketsOptions {
	status?: string[];
	sort?: string;
}

export function useInfiniteTickets(
	projectId: string,
	options?: UseInfiniteTicketsOptions,
) {
	return useInfiniteQuery({
		queryKey: ["projects", projectId, "tickets", "infinite", options],
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
