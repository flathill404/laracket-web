import { useSuspenseQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/Sidebar";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { projectQueries } from "@/features/projects/utils/queries";
import { teamQueries } from "@/features/teams/utils/queries";

export function SuspenseSidebar({ userId }: { userId: string }) {
	const { data: projects } = useSuspenseQuery(projectQueries.list(userId));
	const { data: teams } = useSuspenseQuery(teamQueries.list(userId));
	const { data: organizations } = useSuspenseQuery(organizationQueries.list());

	return (
		<Sidebar projects={projects} teams={teams} organizations={organizations} />
	);
}
