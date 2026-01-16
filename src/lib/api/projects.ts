import { z } from "zod";
import { client } from "@/lib/api/client";

export const projectSchema = z.object({
	id: z.string(),
	name: z.string(),
	// Add other fields as needed
});

export type Project = z.infer<typeof projectSchema>;

const projectsSchema = z.array(projectSchema);

/**
 * Fetches the list of projects for a specific user.
 * @param userId - The ID of the user.
 * @returns An array of projects.
 */
export const fetchProjects = async (userId: string) => {
	const response = await client.get(`/users/${userId}/projects`);
	const json = await response.json();
	return projectsSchema.parse(json.data);
};
