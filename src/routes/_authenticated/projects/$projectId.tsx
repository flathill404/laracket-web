import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import {
	Kanban,
	LayoutList,
	Settings as SettingsIcon,
	Users as UsersIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	const location = useLocation();
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
		<div className="flex h-full flex-col overflow-hidden">
			<Tabs defaultValue="overview" value={currentTab}>
				<div className="grid grid-cols-2">
					<h1 className="font-bold text-2xl">{project?.name}</h1>
					<TabsList>
						{navItems.map((item) => (
							<TabsTrigger key={item.value} value={item.value} asChild>
								<Link
									to={item.to}
									params={{ projectId: params.projectId }}
									className="group"
								>
									<div className="flex items-center gap-2">
										{item.icon}
										{item.label}
									</div>
								</Link>
							</TabsTrigger>
						))}
					</TabsList>
				</div>
				<TabsContent value={currentTab ?? ""}>
					<Outlet />
				</TabsContent>
			</Tabs>
		</div>
	);
}
