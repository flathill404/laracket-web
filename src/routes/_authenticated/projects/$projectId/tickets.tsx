import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { RocketMascot } from "@/components/ui/illustrations/rocket-mascot";
import { Input } from "@/components/ui/input";
import {
	fetchProject,
	fetchProjectTickets,
} from "@/features/projects/api/projects";
import { TicketList } from "@/features/tickets/components/ticket-list";
import { useInfiniteTickets } from "@/features/tickets/hooks/use-infinite-tickets";
import { parseSortParam, toSortParam } from "@/lib/sorting";

const ticketsQuery = (
	projectId: string,
	filters?: { status?: string[]; sort?: string },
) =>
	queryOptions({
		queryKey: ["projects", projectId, "tickets", filters],
		queryFn: () => fetchProjectTickets(projectId, filters),
	});

const projectQuery = (projectId: string) =>
	queryOptions({
		queryKey: ["projects", projectId],
		queryFn: () => fetchProject(projectId),
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
			queryClient.ensureQueryData(projectQuery(projectId)),
		]);
	},
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: project } = useSuspenseQuery(projectQuery(projectId));

	// Use infinite query hook
	const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
		useInfiniteTickets(projectId, {
			status: search.status,
			sort: search.sort,
		});

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
		<div className="flex flex-col h-full bg-background">
			{/* Page Header */}
			<div className="flex items-center justify-between border-b px-6 py-5 shrink-0">
				<h1 className="text-2xl font-semibold tracking-tight">
					{project.name}
				</h1>
				<div className="flex items-center gap-2">
					<div className="relative w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search tickets..."
							className="h-9 w-full pl-9"
						/>
					</div>
					<Button>
						<Plus className="mr-2 h-4 w-4" /> New Ticket
					</Button>
				</div>
			</div>

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
							<Button>
								<Plus className="mr-2 h-4 w-4" /> Create your first ticket
							</Button>
						</EmptyContent>
					</Empty>
				}
			/>
			<Outlet />
		</div>
	);
}
