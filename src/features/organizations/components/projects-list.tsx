import { Link } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/features/projects/types";

interface ProjectsListProps {
	projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
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
				<Link
					key={project.id}
					to="/projects/$projectId/tickets"
					params={{ projectId: project.id }}
				>
					<Card className="transition-colors hover:bg-muted/50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Folder className="h-4 w-4" />
								{project.displayName}
							</CardTitle>
							<CardDescription className="line-clamp-2">
								{project.description || "No description"}
							</CardDescription>
						</CardHeader>
					</Card>
				</Link>
			))}
		</div>
	);
}
