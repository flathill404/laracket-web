import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MembersTable } from "@/features/projects/components/members-table";
import { projectMembersQueryOptions } from "@/features/projects/lib/projects";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/members",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectMembersQueryOptions(params.projectId),
		);
	},
	component: ProjectMembers,
});

function ProjectMembers() {
	const params = Route.useParams();
	const { data: members } = useSuspenseQuery(
		projectMembersQueryOptions(params.projectId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<MembersTable data={members} />
			</div>
		</div>
	);
}
