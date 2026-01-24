import type { z } from "zod";
import type * as schemas from "./schemas";

// Ticket Types
export type TicketStatus = z.infer<typeof schemas.ticketStatusSchema>;
export type Ticket = z.infer<typeof schemas.ticketSchema>;
export type TicketUser = z.infer<typeof schemas.ticketUserSchema>;
export type Assignee = TicketUser;
export type Reviewer = TicketUser;
export type PaginatedTicketsResponse = z.infer<
	typeof schemas.paginatedTicketsSchema
>;

// Activity Types
export type Activity = z.infer<typeof schemas.activitySchema>;
export type ActivityUser = z.infer<typeof schemas.ticketUserSchema>; // Reusing ticketUserSchema as per schemas.ts

// Comment Types
export type Comment = z.infer<typeof schemas.commentSchema>;

// Table Meta
export interface TicketTableMeta {
	selectedStatuses: string[];
	onStatusChange: (statuses: string[]) => void;
	onDeleteTicket?: (ticketId: string) => void;
}

export * from "./schemas";
