import {
	Building2,
	Files,
	Folder,
	Inbox,
	LayoutDashboard,
	Settings,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { CreateOrganizationDialog } from "@/features/organizations/components/CreateOrganizationDialog";
import type { Organization } from "@/features/organizations/types";
import { CreateProjectDialog } from "@/features/projects/components/CreateProjectDialog";
import type { Project } from "@/features/projects/types";
import { CreateTeamDialog } from "@/features/teams/components/CreateTeamDialog";
import type { Team } from "@/features/teams/types";
import { useRouteAwareAccordion } from "@/hooks/useRouteAwareAccordion";
import { SidebarLink } from "./SidebarLink";
import { SidebarSection } from "./SidebarSection";

interface SidebarProps {
	projects: Project[];
	teams: Team[];
	organizations: Organization[];
}

export function Sidebar({ projects, teams, organizations }: SidebarProps) {
	const [createProjectOpen, setCreateProjectOpen] = useState(false);
	const [createTeamOpen, setCreateTeamOpen] = useState(false);
	const [createOrganizationOpen, setCreateOrganizationOpen] = useState(false);

	const [openSections, setOpenSections] = useRouteAwareAccordion({
		"/projects": "projects",
		"/teams": "teams",
		"/organizations": "organizations",
	});

	return (
		<aside className="hidden w-64 flex-col border-r bg-muted/10 md:flex">
			<div className="flex-1 overflow-auto py-4">
				<nav className="flex flex-col gap-1 px-4 font-medium text-sm">
					<SidebarLink to="/dashboard" icon={LayoutDashboard}>
						Dashboard
					</SidebarLink>
					<SidebarLink to="/my-work" icon={Inbox}>
						My Work
					</SidebarLink>
					<SidebarLink to="/tickets" icon={Files}>
						All Tickets
					</SidebarLink>

					<Accordion
						type="multiple"
						className="w-full"
						value={openSections}
						onValueChange={setOpenSections}
					>
						<SidebarSection
							value="projects"
							icon={Folder}
							title="Projects"
							onAddClick={() => setCreateProjectOpen(true)}
							addTooltip="Create Project"
						>
							{projects.map((project) => (
								<SidebarLink
									key={project.id}
									to="/projects/$projectId/tickets"
									params={{ projectId: project.id }}
								>
									{project.name}
								</SidebarLink>
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
								<SidebarLink
									key={team.id}
									to="/teams/$teamId/tickets"
									params={{ teamId: team.id }}
								>
									{team.displayName}
								</SidebarLink>
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
								<SidebarLink
									key={organization.id}
									to="/organizations/$organizationId/overview"
									params={{ organizationId: organization.id }}
								>
									{organization.displayName}
								</SidebarLink>
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
				<SidebarLink to="/settings" icon={Settings}>
					Settings
				</SidebarLink>
			</div>
		</aside>
	);
}
