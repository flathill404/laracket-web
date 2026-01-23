import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	Kanban,
	LayoutList,
	Settings as SettingsIcon,
	Users as UsersIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectQueryOptions } from "@/features/projects/lib/projects";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			projectQueryOptions(params.projectId),
		);
	},
	component: ProjectLayout,
});

function ProjectLayout() {
	const params = Route.useParams();
	const { data: project } = useSuspenseQuery(
		projectQueryOptions(params.projectId),
	);

	const navItems = [
		{
			to: "/projects/$projectId/tickets",
			label: "Tickets",
			icon: <LayoutList className="h-4 w-4" />,
			value: "tickets",
		},
		{
			to: "/projects/$projectId/board",
			label: "Board",
			icon: <Kanban className="h-4 w-4" />,
			value: "board",
		},
		{
			to: "/projects/$projectId/members",
			label: "Members",
			icon: <UsersIcon className="h-4 w-4" />,
			value: "members",
		},
		{
			to: "/projects/$projectId/settings",
			label: "Settings",
			icon: <SettingsIcon className="h-4 w-4" />,
			value: "settings",
		},
	];

	// Determine current tab value based on pathname
	const currentTab = navItems.find((item) =>
		location.pathname.includes(item.value),
	)?.value;

	return (
		<div className="flex flex-col h-full overflow-hidden">
			<div className="flex flex-col border-b bg-background">
				<div className="flex h-16 items-center px-6">
					<h1 className="text-xl font-semibold tracking-tight">
						{project.name}
					</h1>
				</div>
				<div className="px-6">
					<Tabs value={currentTab} className="w-full">
						<TabsList className="w-auto h-auto p-0 bg-transparent border-b-0 rounded-none gap-6">
							{navItems.map((item) => (
								<Link
									key={item.value}
									to={item.to}
									params={{ projectId: params.projectId }}
									className="group"
								>
									<TabsTrigger
										value={item.value}
										className="relative h-9 rounded-none border-b-2 border-transparent bg-transparent px-1 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground"
									>
										<div className="flex items-center gap-2">
											{item.icon}
											{item.label}
										</div>
									</TabsTrigger>
								</Link>
							))}
						</TabsList>
					</Tabs>
				</div>
			</div>
			<div className="flex-1 overflow-auto bg-muted/10 p-6">
				<Outlet />
			</div>
		</div>
	);
}
