import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Folder, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	organizationMembersQueryOptions,
	organizationProjectsQueryOptions,
	organizationQueryOptions,
	organizationTeamsQueryOptions,
} from "@/features/organizations/lib/organizations";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/overview",
)({
	loader: async ({ context, params }) => {
		await Promise.all([
			context.queryClient.ensureQueryData(
				organizationQueryOptions(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationMembersQueryOptions(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationProjectsQueryOptions(params.organizationId),
			),
			context.queryClient.ensureQueryData(
				organizationTeamsQueryOptions(params.organizationId),
			),
		]);
	},
	component: OrganizationOverview,
});

function OrganizationOverview() {
	const params = Route.useParams();
	const { data: organization } = useSuspenseQuery(
		organizationQueryOptions(params.organizationId),
	);
	const { data: members } = useSuspenseQuery(
		organizationMembersQueryOptions(params.organizationId),
	);
	const { data: projects } = useSuspenseQuery(
		organizationProjectsQueryOptions(params.organizationId),
	);
	const { data: teams } = useSuspenseQuery(
		organizationTeamsQueryOptions(params.organizationId),
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
