import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MembersTable } from "@/features/projects/components/MembersTable";
import { projectQueries } from "@/features/projects/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/members",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectQueries.members(params.projectId),
		);
	},
	component: ProjectMembers,
});

function ProjectMembers() {
	const params = Route.useParams();
	const { data: members } = useSuspenseQuery(
		projectQueries.members(params.projectId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<MembersTable data={members} />
			</div>
		</div>
	);
}
