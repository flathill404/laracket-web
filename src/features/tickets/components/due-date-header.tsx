import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import type { Ticket } from "./types";

export function DueDateHeader({ column }: { column: Column<Ticket> }) {
	const sorted = column.getIsSorted();

	return (
		<Button
			variant="ghost"
			size="sm"
			type="button"
			className={cn(
				"-ml-3 h-8 hover:bg-accent/50 data-[state=open]:bg-accent",
				sorted && "text-foreground",
			)}
			onClick={() => column.toggleSorting()}
		>
			<span>Due Date</span>
			{sorted === "asc" ? (
				<ArrowUp className="ml-2 h-4 w-4 text-primary" />
			) : sorted === "desc" ? (
				<ArrowDown className="ml-2 h-4 w-4 text-primary" />
			) : (
				<ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
			)}
		</Button>
	);
}
