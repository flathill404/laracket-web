import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/settings",
)({
	component: ProjectSettings,
});

function ProjectSettings() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
			<p className="text-muted-foreground">Project settings coming soon.</p>
		</div>
	);
}
