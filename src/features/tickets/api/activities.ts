import type { z } from "zod";
import { client } from "@/lib/client";
import { activitiesSchema, activitySchema } from "../types/schemas";

// Re-export schemas for backwards compatibility
export { activitiesSchema, activitySchema };

// Re-export types
export type Activity = z.infer<typeof activitySchema>;

// API Functions
export const fetchTicketActivities = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}/activities`);
	const json = await response.json();
	return activitiesSchema.parse(json.data);
};
