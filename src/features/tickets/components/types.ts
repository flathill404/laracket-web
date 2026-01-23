import type { z } from "zod";
import type { ticketSchema } from "../api/tickets";

export type Ticket = z.infer<typeof ticketSchema>;

export interface TicketTableMeta {
	selectedStatuses: string[];
	onStatusChange: (statuses: string[]) => void;
	onDeleteTicket?: (ticketId: string) => void;
}
