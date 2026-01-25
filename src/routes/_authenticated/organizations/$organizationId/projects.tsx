import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "@/features/organizations/components/ProjectsList";
import { organizationQueries } from "@/features/organizations/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/projects",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationQueries.projects(params.organizationId),
		);
	},
	component: OrganizationProjects,
});

function OrganizationProjects() {
	const params = Route.useParams();
	const { data: projects } = useSuspenseQuery(
		organizationQueries.projects(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<ProjectsList projects={projects} />
			</div>
		</div>
	);
}
