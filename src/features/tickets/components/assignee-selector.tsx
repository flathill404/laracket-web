import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
	type Assignee,
	addTicketAssignee,
	removeTicketAssignee,
} from "../api/tickets";

interface AssigneeSelectorProps {
	ticketId: string;
	projectId: string;
	assignees: Assignee[];
}

export function AssigneeSelector({
	ticketId,
	projectId,
	assignees,
}: AssigneeSelectorProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const { data: members = [] } = useQuery(projectMembersQueryOptions(projectId));

	const { mutate: addAssignee } = useMutation({
		mutationFn: (userId: string) => addTicketAssignee(ticketId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});

	const { mutate: removeAssignee } = useMutation({
		mutationFn: (userId: string) => removeTicketAssignee(ticketId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["tickets"] });
		},
	});

	const assigneeIds = new Set(assignees.map((a) => a.id));
	const availableMembers = members.filter((m) => !assigneeIds.has(m.id));

	const handleSelect = (userId: string) => {
		addAssignee(userId);
		setOpen(false);
	};

	const handleRemove = (userId: string) => {
		removeAssignee(userId);
	};

	return (
		<div className="space-y-2">
			<span className="text-xs font-medium text-muted-foreground">
				Assignees
			</span>
			<div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center">
				{assignees.map((assignee) => (
					<div
						key={assignee.id}
						className="flex items-center gap-2 bg-background border px-2 py-1 rounded-md shadow-sm group"
					>
						<Avatar className="h-5 w-5">
							<AvatarImage src={assignee.avatarUrl ?? undefined} />
							<AvatarFallback className="text-[10px]">
								{assignee.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{assignee.name}</span>
						<button
							type="button"
							onClick={() => handleRemove(assignee.id)}
							className="ml-1 h-4 w-4 rounded-full hover:bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<X className="h-3 w-3 text-muted-foreground" />
						</button>
					</div>
				))}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-muted-foreground border-dashed"
						>
							+ Add Assignee
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0" align="start">
						<Command>
							<CommandInput placeholder="Search members..." />
							<CommandList>
								<CommandEmpty>No members found.</CommandEmpty>
								<CommandGroup>
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
