import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/teams/$teamId/tickets")({
	component: TeamDetail,
});

function TeamDetail() {
	const { teamId } = Route.useParams();

	return (
		<div className="flex flex-col gap-8 p-8">
			<h1 className="text-2xl font-semibold tracking-tight">Team: {teamId}</h1>
			<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
				Team overview and members will appear here.
			</div>
		</div>
	);
}
