import type { z } from "zod";
import type { activitySchema, ticketSchema, ticketUserSchema } from "./schemas";

// Ticket Types
export type Ticket = z.infer<typeof ticketSchema>;
export type TicketUser = z.infer<typeof ticketUserSchema>;
export type Assignee = TicketUser;
export type Reviewer = TicketUser;

// Activity Types
export type Activity = z.infer<typeof activitySchema>;
export type ActivityUser = z.infer<typeof ticketUserSchema>;

// Table Meta
export interface TicketTableMeta {
	selectedStatuses: string[];
	onStatusChange: (statuses: string[]) => void;
	onDeleteTicket?: (ticketId: string) => void;
}

// Re-export schemas
export * from "./schemas";
