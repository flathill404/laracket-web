import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationQueries } from "@/features/organizations/utils/queries";

export function TeamsCard({ organizationId }: { organizationId: string }) {
	const { data: teams } = useSuspenseQuery(
		organizationQueries.teams(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Teams</CardTitle>
				<Building2 className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{teams.length}</div>
				<p className="text-muted-foreground text-xs">
					Teams in this organization
				</p>
			</CardContent>
		</Card>
	);
}
