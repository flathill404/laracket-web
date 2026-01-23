import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ProjectSettingsForm } from "@/features/projects/components/project-settings-form";
import { projectQueryOptions } from "@/features/projects/lib/projects";

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
				<div className="space-y-6">
					<div>
						<h2 className="font-bold text-2xl tracking-tight">Settings</h2>
						<p className="text-muted-foreground text-sm">
							Manage your project settings.
						</p>
					</div>
					<ProjectSettingsForm project={project} />
				</div>
			</div>
		</div>
	);
}
