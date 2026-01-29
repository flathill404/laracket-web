import type { Project, ProjectMember } from "@/features/projects/types";
import { createTicketUser } from "./auth";

export const createProject = (overrides?: Partial<Project>): Project => ({
	id: "project-123",
	name: "test-project",
	displayName: "Test Project",
	description: "Test project description",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
	...overrides,
});

export const createProjects = (count: number): Project[] =>
	Array.from({ length: count }, (_, i) =>
		createProject({
			id: `project-${i + 1}`,
			name: `test-project-${i + 1}`,
			displayName: `Test Project ${i + 1}`,
		}),
	);

export const createProjectMember = (
	overrides?: Partial<ProjectMember>,
): ProjectMember => ({
	...createTicketUser(),
	...overrides,
});
