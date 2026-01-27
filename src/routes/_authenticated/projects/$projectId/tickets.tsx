import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { RocketMascot } from "@/components/illustrations/RocketMascot";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { fetchProjectTickets } from "@/features/projects/api/tickets";
import { CreateTicketDrawer } from "@/features/tickets/components/CreateTicketDrawer";
import { TicketList } from "@/features/tickets/components/TicketList";
import { ticketQueries } from "@/features/tickets/utils/queries";
import { parseSortParam, toSortParam } from "@/lib/sorting";

const ticketsQuery = (
	projectId: string,
	filters?: { status?: string[]; sort?: string },
) =>
	queryOptions({
		queryKey: ["projects", projectId, "tickets", filters],
		queryFn: () =>
			fetchProjectTickets(projectId, {
				filters: { status: filters?.status },
				sort: filters?.sort,
			}),
	});

const searchSchema = z.object({
	status: z.array(z.string()).optional(),
	sort: z.string().optional(),
});

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/tickets",
)({
	validateSearch: (search) => searchSchema.parse(search),
	loaderDeps: ({ search: { status, sort } }) => ({ status, sort }),
	loader: async ({
		context: { queryClient },
		params: { projectId },
		deps: { status, sort },
	}) => {
		await Promise.all([
			queryClient.ensureQueryData(ticketsQuery(projectId, { status, sort })),
		]);
	},
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
		useInfiniteQuery(
			ticketQueries.list(projectId, {
				status: search.status,
				sort: search.sort,
			}),
		);

	const handleStatusChange = (status: string[]) => {
		navigate({
			to: ".",
			search: (prev) => ({
				...prev,
				status: status.length > 0 ? status : undefined,
			}),
		});
	};

	const sorting = parseSortParam(search.sort);

	const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
		const newSorting =
			typeof updaterOrValue === "function"
				? updaterOrValue(sorting)
				: updaterOrValue;

		navigate({
			to: ".",
			search: (prev) => ({ ...prev, sort: toSortParam(newSorting) }),
		});
	};

	const pages = data?.pages ?? [];

	return (
		<div className="flex h-full flex-col bg-background">
			<TicketList
				pages={pages}
				isLoading={isLoading}
				selectedStatuses={search.status}
				onStatusChange={handleStatusChange}
				sorting={sorting}
				onSortingChange={handleSortingChange}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				fetchNextPage={fetchNextPage}
				onTicketClick={(ticket) =>
					navigate({
						to: "/projects/$projectId/tickets/$ticketId",
						params: { projectId, ticketId: ticket.id },
						search: (prev) => prev,
					})
				}
				emptyState={
					<Empty>
						<EmptyMedia>
							<RocketMascot className="size-24" />
						</EmptyMedia>
						<EmptyHeader>
							<EmptyTitle>No tickets yet!</EmptyTitle>
							<EmptyDescription>
								Everything is looking clean. Ready to blast off with a new task?
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="mr-2 h-4 w-4" /> Create your first ticket
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
			<CreateTicketDrawer
				projectId={projectId}
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>
			<Outlet />
		</div>
	);
}
