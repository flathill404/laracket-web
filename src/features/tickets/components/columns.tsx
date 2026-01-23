import type { ColumnDef } from "@tanstack/react-table";
import { ActionsCell } from "./actions-cell";
import { AssigneeCell } from "./assignee-cell";
import { DueDateCell } from "./due-date-cell";
import { DueDateHeader } from "./due-date-header";
import { StatusCell } from "./status-cell";
import { StatusHeader } from "./status-header";
import { SubjectCell } from "./subject-cell";
import type { Ticket, TicketTableMeta } from "./types";

export type { Ticket, TicketTableMeta } from "./types";

export const columns: ColumnDef<Ticket>[] = [
	{
		accessorKey: "subject",
		header: "Subject",
		cell: ({ row }) => <SubjectCell ticket={row.original} />,
		meta: {
			className: "flex-1 min-w-0 pr-4",
		},
	},
	{
		accessorKey: "status",
		header: ({ table }) => {
			const meta = table.options.meta as TicketTableMeta | undefined;
			return (
				<StatusHeader
					selectedStatuses={meta?.selectedStatuses ?? []}
					onStatusChange={meta?.onStatusChange}
				/>
			);
		},
		cell: ({ getValue }) => <StatusCell status={getValue() as string} />,
		meta: {
			className: "w-[150px]",
		},
	},
	{
		accessorKey: "assignees",
		header: "Assignee",
		cell: ({ getValue }) => (
			<AssigneeCell assignees={getValue() as Ticket["assignees"]} />
		),
		meta: {
			className: "w-[140px]",
		},
	},
	{
		accessorKey: "dueDate",
		header: ({ column }) => <DueDateHeader column={column} />,
		cell: ({ getValue }) => (
			<DueDateCell dueDate={getValue() as string | null | undefined} />
		),
		sortDescFirst: false,
		meta: {
			className: "w-[120px]",
		},
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row, table }) => {
			const ticket = row.original;
			const meta = table.options.meta as TicketTableMeta | undefined;
			const onDeleteTicket = meta?.onDeleteTicket;

			return <ActionsCell ticket={ticket} onDeleteTicket={onDeleteTicket} />;
		},
		meta: {
			className: "w-[80px]",
		},
	},
];
