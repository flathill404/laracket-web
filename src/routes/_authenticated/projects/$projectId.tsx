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
	Plus,
	Search,
	Settings as SettingsIcon,
	Users as UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projectQueryOptions } from "@/features/projects/lib/projects";
import { CreateTicketDrawer } from "@/features/tickets/components/create-ticket-drawer";

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
	const [isCreateOpen, setIsCreateOpen] = useState(false);
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
		<Tabs
			defaultValue="overview"
			value={currentTab}
			className="flex h-full flex-col bg-background"
		>
			{/* Page Header */}
			<div className="flex shrink-0 items-center justify-between border-b px-6 py-5">
				<div className="flex items-center gap-6">
					<h1 className="font-semibold text-2xl tracking-tight">
						{project?.name}
					</h1>
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

				<div className="flex items-center gap-4">
					{/* Tickets & Board Actions */}
					{["tickets", "board"].includes(currentTab ?? "") && (
						<>
							<div className="relative w-64">
								<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search tickets..."
									className="h-9 w-full pl-9"
								/>
							</div>
							<Button onClick={() => setIsCreateOpen(true)}>
								<Plus className="mr-2 h-4 w-4" /> New Ticket
							</Button>
						</>
					)}

					{/* Members Actions */}
					{currentTab === "members" && (
						<>
							<Button
								variant="outline"
								onClick={() =>
									toast.info("Assign Team to Project is coming soon")
								}
							>
								<UsersIcon className="mr-2 h-4 w-4" />
								Assign Team
							</Button>
							<Button
								onClick={() =>
									toast.info("Assign Member to Project is coming soon")
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								Assign Member
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Page Content */}
			<TabsContent
				value={currentTab ?? ""}
				className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
			>
				<Outlet />
			</TabsContent>
			<CreateTicketDrawer
				projectId={params.projectId}
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>
		</Tabs>
	);
}
