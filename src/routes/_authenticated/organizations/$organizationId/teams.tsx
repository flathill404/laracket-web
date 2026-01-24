import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { TeamsList } from "@/features/organizations/components/teams-list";
import { organizationTeamsQueryOptions } from "@/features/organizations/lib/organizations";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/teams",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationTeamsQueryOptions(params.organizationId),
		);
	},
	component: OrganizationTeams,
});

function OrganizationTeams() {
	const params = Route.useParams();
	const { data: teams } = useSuspenseQuery(
		organizationTeamsQueryOptions(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<TeamsList teams={teams} />
			</div>
		</div>
	);
}
