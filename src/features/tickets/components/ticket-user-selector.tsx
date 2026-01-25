import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { projectQueries } from "@/features/projects/utils/queries";
import type { TicketUser } from "../types";

interface TicketUserSelectorProps {
	ticketId: string;
	projectId: string;
	users: TicketUser[];
	label: string;
	placeholder?: string;
	addButtonLabel?: string;
	addButtonVariant?: "outline" | "ghost" | "default" | "secondary";
	addButtonClassName?: string;
	onAdd: (user: TicketUser) => void;
	onRemove: (userId: string) => void;
}

export function TicketUserSelector({
	projectId,
	users,
	label,
	placeholder = "Search members...",
	addButtonLabel = "+ Add",
	addButtonVariant = "outline",
	addButtonClassName,
	onAdd,
	onRemove,
}: TicketUserSelectorProps) {
	const [open, setOpen] = useState(false);

	const { data: members = [] } = useQuery(projectQueries.members(projectId));

	const userIds = new Set(users.map((u) => u.id));
	const availableMembers = members.filter((m) => !userIds.has(m.id));

	const handleSelect = (userId: string) => {
		const user = availableMembers.find((m) => m.id === userId);
		if (user) {
			onAdd(user);
			setOpen(false);
		}
	};

	return (
		<div className="space-y-2">
			<span className="font-medium text-muted-foreground text-xs">{label}</span>
			<div className="flex min-h-[2.5rem] flex-wrap items-center gap-2">
				{users.map((user) => (
					<div
						key={user.id}
						className="group flex items-center gap-2 rounded-md border bg-background px-2 py-1 shadow-sm"
					>
						<Avatar className="h-5 w-5">
							<AvatarImage src={user.avatarUrl ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{user.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="font-medium text-sm">{user.name}</span>
						<button
							type="button"
							onClick={() => onRemove(user.id)}
							className="ml-1 flex h-4 w-4 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
						>
							<X className="h-3 w-3 text-muted-foreground" />
						</button>
					</div>
				))}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant={addButtonVariant}
							size="sm"
							className={addButtonClassName}
						>
							{addButtonLabel}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-48 p-0" align="start">
						<Command className="overflow-visible">
							<CommandInput placeholder={placeholder} />
							<CommandList
								className="max-h-48 overflow-y-auto overflow-x-hidden"
								onWheel={(e) => e.stopPropagation()}
							>
								<CommandEmpty>No members found.</CommandEmpty>
								<CommandGroup className="overflow-visible">
									{availableMembers.map((member) => (
										<CommandItem
											key={member.id}
											value={member.name}
											onSelect={() => handleSelect(member.id)}
										>
											<Avatar className="mr-2 h-5 w-5">
												<AvatarImage src={member.avatarUrl ?? undefined} />
												<AvatarFallback className="text-[10px]">
													{member.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span className="text-sm">{member.name}</span>
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
