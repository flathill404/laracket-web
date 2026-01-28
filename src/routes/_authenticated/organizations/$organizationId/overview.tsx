import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { MembersCard } from "@/features/organizations/components/MembersCard";
import { ProjectsCard } from "@/features/organizations/components/ProjectsCard";
import { StatsCardSkeleton } from "@/features/organizations/components/StatsCardSkeleton";
import { TeamsCard } from "@/features/organizations/components/TeamsCard";
import { organizationQueries } from "@/features/organizations/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/overview",
)({
	loader: async ({ context, params }) => {
		// Critical: Block navigation until org detail is ready
		await context.queryClient.ensureQueryData(
			organizationQueries.detail(params.organizationId),
		);

		// Secondary: Start fetching stats, but don't block navigation
		context.queryClient.prefetchQuery(
			organizationQueries.members(params.organizationId),
		);
		context.queryClient.prefetchQuery(
			organizationQueries.projects(params.organizationId),
		);
		context.queryClient.prefetchQuery(
			organizationQueries.teams(params.organizationId),
		);
	},
	component: OrganizationOverview,
});

function OrganizationOverview() {
	const params = Route.useParams();
	const { data: organization } = useSuspenseQuery(
		organizationQueries.detail(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<div className="mb-6">
					<h2 className="font-semibold text-lg">
						Welcome to {organization.displayName}
					</h2>
					<p className="text-muted-foreground text-sm">
						Manage your organization's projects, teams, and members.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<Suspense fallback={<StatsCardSkeleton />}>
						<MembersCard organizationId={params.organizationId} />
					</Suspense>
					<Suspense fallback={<StatsCardSkeleton />}>
						<ProjectsCard organizationId={params.organizationId} />
					</Suspense>
					<Suspense fallback={<StatsCardSkeleton />}>
						<TeamsCard organizationId={params.organizationId} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}
