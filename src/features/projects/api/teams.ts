import { client } from "@/lib/client";
import type { ProjectTeamInput } from "../types";

export const addProjectTeam = async (
	projectId: string,
	input: ProjectTeamInput,
) => {
	// Assuming response returns updated project or simple success. Standard pattern usually returns created resource.
	// But adding team to project might return the pivot or nothing.
	// Based on other APIs, assume it works. If it returns something specific I might need schema.
	// For now, let's assume void or simple success.
	// Actually typical Laravel many-to-many attach returns nothing or array of attached IDs.
	// Let's assume standard client call for now.
	await client.post(`/projects/${projectId}/teams`, input);
};

export const removeProjectTeam = async (projectId: string, teamId: string) => {
	await client.delete(`/projects/${projectId}/teams/${teamId}`);
};
