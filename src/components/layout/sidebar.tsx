import { Link } from "@tanstack/react-router";
import {
	Files,
	Folder,
	Inbox,
	LayoutDashboard,
	Plus,
	Settings,
	Users,
} from "lucide-react";
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
import type { Project } from "@/features/projects/api/projects";
import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import type { Team } from "@/features/teams/api/teams";

interface SidebarProps {
	projects: Project[];
	teams: Team[];
}

export function Sidebar({ projects, teams }: SidebarProps) {
	const [createProjectOpen, setCreateProjectOpen] = useState(false);

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
						<AccordionItem value="projects" className="border-b-0">
							<div className="group flex items-center justify-between pr-2">
								<AccordionTrigger className="w-full py-2 text-muted-foreground hover:text-primary hover:no-underline">
									<div className="flex items-center gap-3 px-3">
										<Folder className="h-4 w-4" />
										Projects
									</div>
								</AccordionTrigger>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<button
												type="button"
												onClick={(e) => {
													e.stopPropagation();
													setCreateProjectOpen(true);
												}}
												className="invisible rounded-sm p-1 hover:bg-muted group-hover:visible"
											>
												<Plus className="h-4 w-4 text-muted-foreground" />
											</button>
										</TooltipTrigger>
										<TooltipContent>Create Project</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<CreateProjectDialog
								open={createProjectOpen}
								onOpenChange={setCreateProjectOpen}
							/>
							<AccordionContent className="pb-0">
								<div className="flex flex-col gap-1 pl-9">
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
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="teams" className="border-b-0">
							<AccordionTrigger className="py-2 text-muted-foreground hover:text-primary hover:no-underline">
								<div className="flex items-center gap-3 px-3">
									<Users className="h-4 w-4" />
									Teams
								</div>
							</AccordionTrigger>
							<AccordionContent className="pb-0">
								<div className="flex flex-col gap-1 pl-9">
									{teams.map((team) => (
										<Link
											key={team.id}
											to="/teams/$teamId/tickets"
											params={{ teamId: team.id }}
											className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:font-semibold [&.active]:text-primary"
										>
											{team.name}
										</Link>
									))}
								</div>
							</AccordionContent>
						</AccordionItem>
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
