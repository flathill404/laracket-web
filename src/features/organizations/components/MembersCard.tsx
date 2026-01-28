import { useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationQueries } from "@/features/organizations/utils/queries";

export function MembersCard({ organizationId }: { organizationId: string }) {
	const { data: members } = useSuspenseQuery(
		organizationQueries.members(organizationId),
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Members</CardTitle>
				<Users className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="font-bold text-2xl">{members.length}</div>
				<p className="text-muted-foreground text-xs">
					Active members in this organization
				</p>
			</CardContent>
		</Card>
	);
}
