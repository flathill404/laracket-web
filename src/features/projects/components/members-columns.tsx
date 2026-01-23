import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Assignee } from "@/features/tickets/api/tickets";

export const columns: ColumnDef<Assignee>[] = [
	{
		accessorKey: "displayName",
		header: "Name",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.avatarUrl ?? undefined} />
						<AvatarFallback>
							{user.displayName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium text-sm leading-none">
							{user.displayName}
						</span>
						<span className="text-muted-foreground text-xs">{user.name}</span>
					</div>
				</div>
			);
		},
	},
	{
		id: "role",
		header: "Role",
		cell: () => <span className="text-muted-foreground text-sm">Member</span>,
	},
	{
		id: "assignment",
		header: "Assignment",
		cell: ({ row }) => {
			const user = row.original;
			// Mock logic: Deterministic assignment source based on ID
			const isDirect = user.id.charCodeAt(0) % 2 === 0;
			return (
				<Badge variant={isDirect ? "secondary" : "outline"}>
					{isDirect ? "Direct" : "Via Team"}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copy ID
            </DropdownMenuItem> */}
						<DropdownMenuItem
							onClick={() =>
								toast.info(`Withdraw ${user.displayName} is coming soon`)
							}
							className="text-destructive focus:text-destructive"
						>
							Withdraw
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
