import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import {
	Folder,
	LayoutDashboard,
	Plus,
	Settings as SettingsIcon,
	Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { organizationQueryOptions } from "@/features/organizations/lib/organizations";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationQueryOptions(params.organizationId),
		);
	},
	component: OrganizationLayout,
});

function OrganizationLayout() {
	const params = Route.useParams();
	const location = useLocation();
	const { data: organization } = useSuspenseQuery(
		organizationQueryOptions(params.organizationId),
	);

	const navItems = [
		{
			to: "/organizations/$organizationId/overview",
			label: "Overview",
			icon: <LayoutDashboard className="h-4 w-4" />,
			value: "overview",
		},
		{
			to: "/organizations/$organizationId/members",
			label: "Members",
			icon: <UsersIcon className="h-4 w-4" />,
			value: "members",
		},
		{
			to: "/organizations/$organizationId/projects",
			label: "Projects",
			icon: <Folder className="h-4 w-4" />,
			value: "projects",
		},
		{
			to: "/organizations/$organizationId/teams",
			label: "Teams",
			icon: <UsersIcon className="h-4 w-4" />,
			value: "teams",
		},
		{
			to: "/organizations/$organizationId/settings",
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
				<h1 className="font-semibold text-2xl tracking-tight">
					{organization?.displayName}
				</h1>
				<TabsList className="ml-4">
					{navItems.map((item) => (
						<TabsTrigger key={item.value} value={item.value} asChild>
							<Link
								to={item.to}
								params={{ organizationId: params.organizationId }}
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
				<div className="flex-1" />

				{/* Members Actions */}
				{currentTab === "members" && (
					<div className="flex items-center gap-2">
						<Button onClick={() => toast.info("Invite Member is coming soon")}>
							<Plus className="mr-2 h-4 w-4" />
							Invite Member
						</Button>
					</div>
				)}

				{/* Projects Actions */}
				{currentTab === "projects" && (
					<div className="flex items-center gap-2">
						<Button onClick={() => toast.info("Create Project is coming soon")}>
							<Plus className="mr-2 h-4 w-4" />
							New Project
						</Button>
					</div>
				)}

				{/* Teams Actions */}
				{currentTab === "teams" && (
					<div className="flex items-center gap-2">
						<Button onClick={() => toast.info("Create Team is coming soon")}>
							<Plus className="mr-2 h-4 w-4" />
							New Team
						</Button>
					</div>
				)}
			</div>

			{/* Page Content */}
			<TabsContent
				value={currentTab ?? ""}
				className="flex-1 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
			>
				<Outlet />
			</TabsContent>
		</Tabs>
	);
}
