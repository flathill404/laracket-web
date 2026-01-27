import { Link } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/features/projects/types";

interface ProjectsListProps {
	projects: Project[];
	onProjectClick: (project: Project) => void;
}

export function ProjectsList({ projects, onProjectClick }: ProjectsListProps) {
	if (projects.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<Folder className="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="font-semibold text-lg">No projects yet</h3>
				<p className="text-muted-foreground text-sm">
					Create your first project to get started.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{projects.map((project) => (
				<Card
					key={project.id}
					className="group relative cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md"
					onClick={() => onProjectClick(project)}
				>
					<CardHeader>
						<div className="flex items-start justify-between gap-2">
							<div className="space-y-1">
								<CardTitle className="flex items-center gap-2 text-base">
									<Folder className="h-4 w-4 text-blue-500" />
									<span className="group-hover:text-primary group-hover:underline">
										{project.displayName}
									</span>
								</CardTitle>
								<CardDescription className="line-clamp-2 text-xs">
									{project.description || "No description"}
								</CardDescription>
							</div>
						</div>
					</CardHeader>

					<div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
							asChild
						>
							<Link
								to="/projects/$projectId/tickets"
								params={{ projectId: project.id }}
								onClick={(e) => e.stopPropagation()}
							>
								<Folder className="h-4 w-4" />
								<span className="sr-only">Go to Project</span>
							</Link>
						</Button>
					</div>
				</Card>
			))}
		</div>
	);
}
