import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/projects/$projectId/members",
)({
	component: ProjectMembers,
});

function ProjectMembers() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold tracking-tight">Members</h2>
			<p className="text-muted-foreground">Member management coming soon.</p>
		</div>
	);
}
