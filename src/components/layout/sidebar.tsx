import { Link } from "@tanstack/react-router";
import {
	Building2,
	ChevronRight,
	Files,
	Folder,
	Inbox,
	LayoutDashboard,
	Plus,
	Settings,
	Users,
} from "lucide-react";
import type { ElementType } from "react";
import { useState } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Organization } from "@/features/organizations/api/organizations";
import { CreateOrganizationDialog } from "@/features/organizations/components/create-organization-dialog";
import type { Project } from "@/features/projects/api/projects";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import type { Team } from "@/features/teams/api/teams";
import { CreateTeamDialog } from "@/features/teams/components/create-team-dialog";

interface SidebarProps {
	projects: Project[];
	teams: Team[];
	organizations: Organization[];
}

interface SidebarSectionProps {
	value: string;
	icon: ElementType;
	title: string;
	onAddClick: () => void;
	addTooltip: string;
	children: React.ReactNode;
}

function SidebarSection({
	value,
	icon: Icon,
	title,
	onAddClick,
	addTooltip,
	children,
}: SidebarSectionProps) {
	return (
		<AccordionItem value={value} className="border-b-0">
			<div className="group flex items-center justify-between pr-2">
				<AccordionTrigger className="w-full py-2 text-muted-foreground hover:text-primary hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]_.custom-chevron]:rotate-90">
					<div className="flex items-center gap-3 px-3">
						<ChevronRight className="custom-chevron h-4 w-4 shrink-0 transition-transform duration-200" />
						<Icon className="h-4 w-4" />
						{title}
					</div>
				</AccordionTrigger>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onAddClick();
								}}
								className="invisible rounded-sm p-1 hover:bg-muted group-hover:visible"
							>
								<Plus className="h-4 w-4 text-muted-foreground" />
							</button>
						</TooltipTrigger>
						<TooltipContent>{addTooltip}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<AccordionContent className="pb-0">
				<div className="flex flex-col gap-1 pl-9">{children}</div>
			</AccordionContent>
		</AccordionItem>
	);
}

export function Sidebar({ projects, teams, organizations }: SidebarProps) {
	const [createProjectOpen, setCreateProjectOpen] = useState(false);
	const [createTeamOpen, setCreateTeamOpen] = useState(false);
	const [createOrganizationOpen, setCreateOrganizationOpen] = useState(false);

	return (
		<aside className="hidden w-64 flex-col border-r bg-muted/10 md:flex">
			<div className="flex-1 overflow-auto py-4">
				<nav className="flex flex-col gap-1 px-4 font-medium text-sm">
					<Link
						to="/dashboard"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
					>
						<LayoutDashboard className="h-4 w-4" />
						Dashboard
					</Link>
					<Link
						to="/my-work"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
					>
						<Inbox className="h-4 w-4" />
						My Work
					</Link>
					<Link
						to="/tickets"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
					>
						<Files className="h-4 w-4" />
						All Tickets
					</Link>

					<Accordion type="multiple" className="w-full">
						<SidebarSection
							value="projects"
							icon={Folder}
							title="Projects"
							onAddClick={() => setCreateProjectOpen(true)}
							addTooltip="Create Project"
						>
							{projects.map((project) => (
								<Link
									key={project.id}
									to="/projects/$projectId/tickets"
									params={{ projectId: project.id }}
									className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:font-semibold [&.active]:text-primary"
								>
									{project.name}
								</Link>
							))}
						</SidebarSection>
						<CreateProjectDialog
							open={createProjectOpen}
							onOpenChange={setCreateProjectOpen}
						/>

						<SidebarSection
							value="teams"
							icon={Users}
							title="Teams"
							onAddClick={() => setCreateTeamOpen(true)}
							addTooltip="Create Team"
						>
							{teams.map((team) => (
								<Link
									key={team.id}
									to="/teams/$teamId/tickets"
									params={{ teamId: team.id }}
									className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:font-semibold [&.active]:text-primary"
								>
									{team.displayName}
								</Link>
							))}
						</SidebarSection>
						<CreateTeamDialog
							open={createTeamOpen}
							onOpenChange={setCreateTeamOpen}
						/>

						<SidebarSection
							value="organizations"
							icon={Building2}
							title="Organizations"
							onAddClick={() => setCreateOrganizationOpen(true)}
							addTooltip="Create Organization"
						>
							{organizations.map((organization) => (
								<Link
									key={organization.id}
									to="/organizations/$organizationId/overview"
									params={{ organizationId: organization.id }}
									className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:font-semibold [&.active]:text-primary"
								>
									{organization.displayName}
								</Link>
							))}
						</SidebarSection>
						<CreateOrganizationDialog
							open={createOrganizationOpen}
							onOpenChange={setCreateOrganizationOpen}
						/>
					</Accordion>
				</nav>
			</div>

			<div className="mt-auto border-t p-4">
				<Link
					to="/settings"
					className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-muted-foreground text-sm transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
				>
					<Settings className="h-4 w-4" />
					Settings
				</Link>
			</div>
		</aside>
	);
}
