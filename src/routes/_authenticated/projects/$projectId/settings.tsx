import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectSettingsForm } from "@/features/projects/components/project-settings-form";
import { projectQueryOptions } from "@/features/projects/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/settings",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectQueryOptions(params.projectId),
		);
	},
	component: ProjectSettings,
});

function ProjectSettings() {
	const params = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectQueryOptions(params.projectId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<div className="mx-auto max-w-4xl space-y-8">
					<div>
						<h3 className="font-medium text-lg">General</h3>
						<p className="text-muted-foreground text-sm">
							Manage your project settings and preferences.
						</p>
					</div>
					<ProjectSettingsForm project={project} />
				</div>
			</div>
		</div>
	);
}
