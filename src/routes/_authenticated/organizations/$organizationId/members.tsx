import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { MembersTable } from "@/features/projects/components/MembersTable";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/members",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationQueries.members(params.organizationId),
		);
	},
	component: OrganizationMembers,
});

function OrganizationMembers() {
	const params = Route.useParams();
	const { data: members } = useSuspenseQuery(
		organizationQueries.members(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<MembersTable data={members} />
			</div>
		</div>
	);
}
