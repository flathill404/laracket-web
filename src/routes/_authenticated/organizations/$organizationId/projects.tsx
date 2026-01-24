import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "@/features/organizations/components/projects-list";
import { organizationProjectsQueryOptions } from "@/features/organizations/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/projects",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationProjectsQueryOptions(params.organizationId),
		);
	},
	component: OrganizationProjects,
});

function OrganizationProjects() {
	const params = Route.useParams();
	const { data: projects } = useSuspenseQuery(
		organizationProjectsQueryOptions(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<ProjectsList projects={projects} />
			</div>
		</div>
	);
}
