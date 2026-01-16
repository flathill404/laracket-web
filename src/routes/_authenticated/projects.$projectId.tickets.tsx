import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/tickets",
)({
	component: ProjectDetail,
});

function ProjectDetail() {
	const { projectId } = Route.useParams();

	return (
		<div className="flex flex-col gap-8 p-8">
			<h1 className="text-2xl font-semibold tracking-tight">
				Project: {projectId}
			</h1>
			<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
				Project details and assigned tickets will appear here.
			</div>
		</div>
	);
}
