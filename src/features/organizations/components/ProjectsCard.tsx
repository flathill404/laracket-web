import { useSuspenseQuery } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationQueries } from "@/features/organizations/utils/queries";

export function ProjectsCard({ organizationId }: { organizationId: string }) {
	const { data: projects } = useSuspenseQuery(
		organizationQueries.projects(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Projects</CardTitle>
				<Folder className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{projects.length}</div>
				<p className="text-muted-foreground text-xs">
					Projects in this organization
				</p>
			</CardContent>
		</Card>
	);
}
