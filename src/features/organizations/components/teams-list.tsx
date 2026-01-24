import { Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Team } from "@/features/teams/api/teams";

interface TeamsListProps {
	teams: Team[];
}

export function TeamsList({ teams }: TeamsListProps) {
	if (teams.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Users className="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="font-semibold text-lg">No teams yet</h3>
				<p className="text-muted-foreground text-sm">
					Create your first team to get started.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{teams.map((team) => (
				<Link
					key={team.id}
					to="/teams/$teamId/tickets"
					params={{ teamId: team.id }}
				>
					<Card className="transition-colors hover:bg-muted/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Users className="h-4 w-4" />
								{team.displayName}
							</CardTitle>
							<CardDescription>@{team.name}</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	);
}
