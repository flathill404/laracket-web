import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TeamsList } from "@/features/organizations/components/TeamsList";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { TeamDetailSheet } from "@/features/teams/components/TeamDetailSheet";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/teams",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationQueries.teams(params.organizationId),
		);
	},
	component: OrganizationTeams,
});

function OrganizationTeams() {
	const params = Route.useParams();
	const { data: teams } = useSuspenseQuery(
		organizationQueries.teams(params.organizationId),
	);

	const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<TeamsList
					teams={teams}
					onTeamClick={(team) => setSelectedTeamId(team.id)}
				/>
			</div>

			{selectedTeamId && (
				<TeamDetailSheet
					organizationId={params.organizationId}
					teamId={selectedTeamId}
					open={!!selectedTeamId}
					onOpenChange={(open) => !open && setSelectedTeamId(null)}
				/>
			)}
		</div>
	);
}
