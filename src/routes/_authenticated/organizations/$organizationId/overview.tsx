import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Folder, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationQueries } from "@/features/organizations/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/overview",
)({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				organizationQueries.detail(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationQueries.members(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationQueries.projects(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationQueries.teams(params.organizationId),
			),
		]);
	},
	component: OrganizationOverview,
});

function OrganizationOverview() {
	const params = Route.useParams();
	const { data: organization } = useSuspenseQuery(
		organizationQueries.detail(params.organizationId),
	);
	const { data: members } = useSuspenseQuery(
		organizationQueries.members(params.organizationId),
	);
	const { data: projects } = useSuspenseQuery(
		organizationQueries.projects(params.organizationId),
	);
	const { data: teams } = useSuspenseQuery(
		organizationQueries.teams(params.organizationId),
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
				</div>
			</div>
		</div>
	);
}
