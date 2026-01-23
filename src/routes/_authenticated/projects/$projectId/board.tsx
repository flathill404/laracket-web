import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/board",
)({
	component: ProjectBoard,
});

function ProjectBoard() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-bold text-2xl tracking-tight">Board</h2>
			<p className="text-muted-foreground">Kanban board view coming soon.</p>
		</div>
	);
}
