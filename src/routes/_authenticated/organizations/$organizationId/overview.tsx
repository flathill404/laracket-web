import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Folder, Users } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

function MembersCard({ organizationId }: { organizationId: string }) {
	const { data: members } = useSuspenseQuery(
		organizationQueries.members(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Members</CardTitle>
				<Users className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{members.length}</div>
				<p className="text-muted-foreground text-xs">
					Active members in this organization
				</p>
			</CardContent>
		</Card>
	);
}

function ProjectsCard({ organizationId }: { organizationId: string }) {
	const { data: projects } = useSuspenseQuery(
		organizationQueries.projects(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Projects</CardTitle>
				<Folder className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{projects.length}</div>
				<p className="text-muted-foreground text-xs">
					Projects in this organization
				</p>
			</CardContent>
		</Card>
	);
}

function TeamsCard({ organizationId }: { organizationId: string }) {
	const { data: teams } = useSuspenseQuery(
		organizationQueries.teams(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Teams</CardTitle>
				<Building2 className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{teams.length}</div>
				<p className="text-muted-foreground text-xs">
					Teams in this organization
				</p>
			</CardContent>
		</Card>
	);
}

function StatsCardSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-4 rounded" />
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-1 h-8 w-10" />
				<Skeleton className="h-3 w-40" />
			</CardContent>
		</Card>
	);
}
