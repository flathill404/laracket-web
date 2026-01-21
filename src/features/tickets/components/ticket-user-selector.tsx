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
import { projectMembersQueryOptions } from "@/features/projects/lib/projects";
import type { TicketUser } from "../api/tickets";

interface TicketUserSelectorProps {
	ticketId: string;
	projectId: string;
	users: TicketUser[];
	label: string;
	placeholder?: string;
	addButtonLabel?: string;
	addButtonVariant?: "outline" | "ghost" | "default" | "secondary";
	addButtonClassName?: string;
	onAdd: (userId: string) => void;
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

	const { data: members = [] } = useQuery(
		projectMembersQueryOptions(projectId),
	);

	const userIds = new Set(users.map((u) => u.id));
	const availableMembers = members.filter((m) => !userIds.has(m.id));

	const handleSelect = (userId: string) => {
		onAdd(userId);
		setOpen(false);
	};

	return (
		<div className="space-y-2">
			<span className="text-xs font-medium text-muted-foreground">{label}</span>
			<div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center">
				{users.map((user) => (
					<div
						key={user.id}
						className="flex items-center gap-2 bg-background border px-2 py-1 rounded-md shadow-sm group"
					>
						<Avatar className="h-5 w-5">
							<AvatarImage src={user.avatarUrl ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{user.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{user.name}</span>
						<button
							type="button"
							onClick={() => onRemove(user.id)}
							className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
					<PopoverContent className="w-[200px] p-0" align="start">
						<Command className="overflow-visible">
							<CommandInput placeholder={placeholder} />
							<CommandList
								className="max-h-[200px] overflow-y-auto overflow-x-hidden"
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
											<Avatar className="h-5 w-5 mr-2">
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
