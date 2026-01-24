import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MembersTable } from "@/features/projects/components/members-table";
import { organizationMembersQueryOptions } from "@/features/organizations/lib/organizations";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/members",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationMembersQueryOptions(params.organizationId),
		);
	},
	component: OrganizationMembers,
});

function OrganizationMembers() {
	const params = Route.useParams();
	const { data: members } = useSuspenseQuery(
		organizationMembersQueryOptions(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<MembersTable data={members} />
			</div>
		</div>
	);
}
