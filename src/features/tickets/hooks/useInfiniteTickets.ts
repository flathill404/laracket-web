import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProjectTickets } from "@/features/projects/api/tickets";
import { queryKeys } from "@/lib/queryKeys";

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
			...queryKeys.projects.tickets(projectId),
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
