import { z } from "zod";
import { client } from "@/lib/client";
import { ticketStatusSchema } from "./tickets";

const activityUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	avatarUrl: z.string().nullish(),
});

const statusChangePayloadSchema = z.object({
	status: z.object({
		from: ticketStatusSchema,
		to: ticketStatusSchema,
	}),
});

const activityPayloadSchema = z
	.union([statusChangePayloadSchema, z.record(z.string(), z.unknown())])
	.nullish();

export const activitySchema = z.object({
	id: z.number(),
	type: z.enum(["created", "updated"]),
	payload: activityPayloadSchema,
	createdAt: z.iso.datetime(),
	user: activityUserSchema,
});

export const activitiesSchema = z.array(activitySchema);

export type Activity = z.infer<typeof activitySchema>;
export type ActivityUser = z.infer<typeof activityUserSchema>;

export const fetchTicketActivities = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}/activities`);
	const json = await response.json();
	return activitiesSchema.parse(json.data);
};
