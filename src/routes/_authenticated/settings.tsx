import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/settings")({
	component: Settings,
});

function Settings() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
			<div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
				Application settings will appear here.
			</div>
		</div>
	);
}
