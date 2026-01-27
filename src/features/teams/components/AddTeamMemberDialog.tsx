import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { cn } from "@/lib/cn";
import { teamQueries } from "../api/queries";
import { useTeamMembers } from "../hooks/useTeamMembers";

interface AddTeamMemberDialogProps {
	organizationId: string;
	teamId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AddTeamMemberDialog({
	organizationId,
	teamId,
	open,
	onOpenChange,
}: AddTeamMemberDialogProps) {
	const { data: orgMembers } = useSuspenseQuery(
		organizationQueries.members(organizationId),
	);
	const { data: teamMembers } = useSuspenseQuery(teamQueries.members(teamId));

	const { actions } = useTeamMembers(teamId);
	const addMemberMutation = actions.add;

	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [openCombobox, setOpenCombobox] = useState(false);

	// Filter out users who are already in the team
	const availableMembers = orgMembers.filter(
		(orgMember) =>
			!teamMembers.some((teamMember) => teamMember.id === orgMember.id),
	);

	const selectedUser = availableMembers.find((m) => m.id === selectedUserId);

	const handleSubmit = () => {
		if (!selectedUserId) return;

		addMemberMutation.mutate(
			{ userId: selectedUserId },
			{
				onSuccess: () => {
					toast.success("Member added");
					onOpenChange(false);
					setSelectedUserId(null);
				},
				onError: () => {
					toast.error("Failed to add member");
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Team Member</DialogTitle>
					<DialogDescription>
						Select a member from the organization to add to this team.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<div className="flex flex-col gap-4">
						<Popover open={openCombobox} onOpenChange={setOpenCombobox}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={openCombobox}
									className="justify-between"
								>
									{selectedUser ? (
										<div className="flex items-center gap-2">
											<Avatar className="h-5 w-5">
												<AvatarImage
													src={selectedUser.avatarUrl ?? undefined}
												/>
												<AvatarFallback className="text-[10px]">
													{selectedUser.displayName.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<span>{selectedUser.displayName}</span>
										</div>
									) : (
										"Select member..."
									)}
									<Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="p-0" align="start">
								<Command>
									<CommandInput placeholder="Search members..." />
									<CommandList>
										<CommandEmpty>No members found.</CommandEmpty>
										<CommandGroup>
											{availableMembers.map((member) => (
												<CommandItem
													key={member.id}
													value={member.displayName}
													onSelect={() => {
														setSelectedUserId(member.id);
														setOpenCombobox(false);
													}}
												>
													<div className="flex items-center gap-2">
														<Avatar className="h-6 w-6">
															<AvatarImage
																src={member.avatarUrl ?? undefined}
															/>
															<AvatarFallback className="text-[10px]">
																{member.displayName.slice(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="flex flex-col">
															<span>{member.displayName}</span>
															<span className="text-muted-foreground text-xs">
																@{member.name}
															</span>
														</div>
													</div>
													<Check
														className={cn(
															"ml-auto h-4 w-4",
															selectedUserId === member.id
																? "opacity-100"
																: "opacity-0",
														)}
													/>
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={addMemberMutation.isPending}
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!selectedUserId || addMemberMutation.isPending}
					>
						{addMemberMutation.isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						Add Member
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
