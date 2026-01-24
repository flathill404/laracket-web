import { client } from "@/lib/client";
import { commentSchema, commentsSchema } from "../types/schemas";

// API Functions
export const fetchTicketComments = async (ticketId: string) => {
	const response = await client.get(`/tickets/${ticketId}/comments`);
	const json = await response.json();
	return commentsSchema.parse(json.data);
};

export const createTicketComment = async (
	ticketId: string,
	data: { content: string },
) => {
	const response = await client.post(`/tickets/${ticketId}/comments`, data);
	const json = await response.json();
	return commentSchema.parse(json.data);
};
