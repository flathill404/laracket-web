import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import {
	Bold,
	ChevronRight,
	Circle,
	Image as ImageIcon,
	Italic,
	Link as LinkIcon,
	List,
	MoreHorizontal,
	Paperclip,
	Send,
	Smile,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
	getAllStatuses,
	getStatusBadgeVariant,
	getStatusColor,
	getStatusLabel,
} from "@/features/tickets/utils";
import { useAppForm } from "@/hooks/use-app-form";
import {
	addTicketAssignee,
	addTicketReviewer,
	removeTicketAssignee,
	removeTicketReviewer,
	type TicketStatusType,
	type TicketUser,
	updateTicket,
	updateTicketStatus,
} from "../api/tickets";
import { projectTicketsQueryKey, ticketQueryOptions } from "../lib/tickets";
import { TicketUserSelector } from "./ticket-user-selector";

export interface TicketDetailSheetProps {
	ticketId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function TicketDetailSheet({
	ticketId,
	open,
	onOpenChange,
}: TicketDetailSheetProps) {
	const queryClient = useQueryClient();
	const { data: ticket } = useSuspenseQuery(ticketQueryOptions(ticketId));

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const titleForm = useAppForm({
		defaultValues: {
			title: ticket.title,
		},
		onSubmit: async ({ value }) => {
			const trimmedTitle = value.title.trim();
			if (trimmedTitle && trimmedTitle !== ticket.title) {
				await updateTicket(ticketId, { title: trimmedTitle });
				queryClient.setQueryData(
					ticketQueryOptions(ticketId).queryKey,
					(old) => (old ? { ...old, title: trimmedTitle } : old),
				);
				queryClient.invalidateQueries({
					queryKey: projectTicketsQueryKey(ticket.projectId),
				});
				queryClient.invalidateQueries({
					queryKey: ticketQueryOptions(ticketId).queryKey,
				});
			}
			setIsEditingTitle(false);
			titleInputRef.current?.blur();
		},
	});

	useEffect(() => {
		titleForm.setFieldValue("title", ticket.title);
	}, [ticket.title, titleForm]);

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			titleForm.handleSubmit();
		} else if (e.key === "Escape") {
			titleForm.reset();
			setIsEditingTitle(false);
			titleInputRef.current?.blur();
		}
	};

	const { mutate: mutateStatus } = useMutation({
		mutationFn: (status: TicketStatusType) =>
			updateTicketStatus(ticketId, status),
		onSuccess: (_, variables) => {
			queryClient.setQueryData(ticketQueryOptions(ticketId).queryKey, (old) =>
				old
					? {
							...old,
							status: variables,
						}
					: old,
			);
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(ticket.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
	});

	const { mutate: addAssignee } = useMutation({
		mutationFn: (user: TicketUser) => addTicketAssignee(ticketId, user.id),
		onSuccess: (_, user) => {
			queryClient.setQueryData(ticketQueryOptions(ticketId).queryKey, (old) =>
				old
					? {
							...old,
							assignees: [...old.assignees, user],
						}
					: old,
			);
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(ticket.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
	});

	const { mutate: removeAssignee } = useMutation({
		mutationFn: (userId: string) => removeTicketAssignee(ticketId, userId),
		onSuccess: (_, userId) => {
			queryClient.setQueryData(ticketQueryOptions(ticketId).queryKey, (old) =>
				old
					? {
							...old,
							assignees: old.assignees.filter((a) => a.id !== userId),
						}
					: old,
			);
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(ticket.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
	});

	const { mutate: addReviewer } = useMutation({
		mutationFn: (user: TicketUser) => addTicketReviewer(ticketId, user.id),
		onSuccess: (_, user) => {
			queryClient.setQueryData(ticketQueryOptions(ticketId).queryKey, (old) =>
				old
					? {
							...old,
							reviewers: [...old.reviewers, user],
						}
					: old,
			);
			queryClient.invalidateQueries({
				queryKey: projectTicketsQueryKey(ticket.projectId),
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
	});

	const { mutate: removeReviewer } = useMutation({
		mutationFn: (userId: string) => removeTicketReviewer(ticketId, userId),
		onSuccess: (_, userId) => {
			queryClient.setQueryData(ticketQueryOptions(ticketId).queryKey, (old) =>
				old
					? {
							...old,
							reviewers: old.reviewers.filter((r) => r.id !== userId),
						}
					: old,
			);
			queryClient.invalidateQueries({
				queryKey: ["projects", ticket.projectId, "tickets"],
			});
			queryClient.invalidateQueries({
				queryKey: ticketQueryOptions(ticketId).queryKey,
			});
		},
	});

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] sm:max-w-5xl p-0 gap-0 overflow-hidden"
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between gap-4 px-6 py-3 border-b shrink-0 bg-background z-10">
						<div className="flex flex-1 items-center gap-4 min-w-0">
							<SheetClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</SheetClose>
							<div className="flex flex-1 items-center gap-3 min-w-0">
								<span className="text-sm font-medium text-muted-foreground shrink-0">
									[T-{ticket.id.slice(0, 8)}]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<SheetTitle className="flex-1 min-w-0 m-0">
									<titleForm.Field name="title">
										{(field) => (
											<Input
												ref={titleInputRef}
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onKeyDown={handleTitleKeyDown}
												onFocus={() => setIsEditingTitle(true)}
												onBlur={() => {
													setIsEditingTitle(false);
													titleForm.reset();
												}}
												className={`flex-1 text-lg! font-semibold h-auto py-0.5 px-1 border-transparent bg-transparent shadow-none rounded focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:border-input focus-visible:bg-background ${!isEditingTitle ? "cursor-pointer hover:bg-muted/50" : ""}`}
											/>
										)}
									</titleForm.Field>
								</SheetTitle>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Select
								value={ticket.status}
								onValueChange={(value) =>
									mutateStatus(value as TicketStatusType)
								}
							>
								<SelectTrigger
									className={`h-8 w-[160px] gap-2 border-dashed ${getStatusBadgeVariant(
										ticket.status,
									)}`}
								>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent position="popper">
									{getAllStatuses().map((status) => (
										<SelectItem key={status} value={status}>
											<div className="flex items-center gap-2">
												<Circle
													className={`h-2 w-2 ${getStatusColor(status)}`}
												/>
												<span>{getStatusLabel(status)}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Body: 2 Columns */}
					<div className="flex flex-1 overflow-hidden">
						{/* Main Column (Left) */}
						<div className="flex-1 flex flex-col w-[65%] min-w-0 bg-background">
							{/* Scrollable Content */}
							<div className="flex-1 overflow-y-auto px-8 py-6">
								{/* Description Section */}
								<div className="flex gap-4 mb-8">
									<Avatar className="h-10 w-10 mt-1">
										<AvatarImage
											src={ticket.assignees[0]?.avatarUrl ?? undefined}
										/>
										<AvatarFallback>
											{ticket.assignees[0]?.name.slice(0, 2).toUpperCase() ??
												"U"}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1 space-y-2">
										<div className="flex items-baseline gap-2">
											<span className="font-semibold">
												{ticket.assignees[0]?.name ?? "Unassigned"}
											</span>
											<span className="text-xs text-muted-foreground">
												created this ticket on{" "}
												{new Date(ticket.createdAt).toLocaleDateString()}
											</span>
										</div>
										<div className="prose prose-sm max-w-none text-foreground leading-relaxed">
											{ticket.description}
										</div>
									</div>
								</div>

								<Separator className="my-8" />

								{/* Timeline (Mocked) */}
								<div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-[19px] before:w-[2px] before:bg-muted">
									{/* Activity 1 */}
									<div className="relative pl-14">
										<div className="absolute left-0 top-1 h-10 w-10 flex items-center justify-center rounded-full bg-background border-2 border-muted z-10">
											<div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
										</div>
										<div className="pt-2">
											<span className="font-semibold text-sm">Jane Doe</span>{" "}
											<span className="text-sm text-muted-foreground">
												changed status to In Progress
											</span>
											<span className="ml-2 text-xs text-muted-foreground">
												2 days ago
											</span>
										</div>
									</div>

									{/* Activity 2 - Comment */}
									<div className="relative pl-14">
										<Avatar className="absolute left-0 top-0 h-10 w-10 border-2 border-background z-10">
											<AvatarFallback>JD</AvatarFallback>
										</Avatar>
										<div className="space-y-2">
											<div className="flex items-baseline gap-2">
												<span className="font-semibold text-sm">Jane Doe</span>
												<span className="text-xs text-muted-foreground">
													commented yesterday
												</span>
											</div>
											<div className="bg-muted/30 p-4 rounded-lg text-sm">
												I've started investigating this issue. Looks like a race
												condition.
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Sticky Footer Input */}
							<div className="p-4 border-t bg-background shrink-0">
								<div className="border rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-ring">
									<Textarea
										placeholder="Leave a comment..."
										className="min-h-[80px] border-0 focus-visible:ring-0 resize-none p-3 text-sm"
									/>
									<div className="flex items-center justify-between p-2 bg-muted/20 border-t rounded-b-lg">
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<Bold className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<Italic className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<List className="h-4 w-4" />
											</Button>
											<Separator orientation="vertical" className="h-4 mx-1" />
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<LinkIcon className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<ImageIcon className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-muted-foreground"
											>
												<Smile className="h-4 w-4" />
											</Button>
										</div>
										<div className="flex items-center gap-2">
											<Button size="sm" className="gap-2">
												Send <Send className="h-3.5 w-3.5" />
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Sidebar Column (Right) */}
						<div className="w-[35%] min-w-[300px] border-l bg-muted/5 overflow-y-auto p-6 space-y-8">
							{/* Properties */}
							<div className="space-y-6">
								<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Properties
								</h4>

								<div className="space-y-5">
									<TicketUserSelector
										ticketId={ticket.id}
										projectId={ticket.projectId}
										users={ticket.assignees}
										label="Assignees"
										addButtonLabel="+ Add Assignee"
										addButtonVariant="outline"
										addButtonClassName="h-8 text-muted-foreground border-dashed"
										onAdd={(userId) => addAssignee(userId)}
										onRemove={(userId) => removeAssignee(userId)}
									/>

									<TicketUserSelector
										ticketId={ticket.id}
										projectId={ticket.projectId}
										users={ticket.reviewers}
										label="Reviewers"
										addButtonLabel="+ Add Reviewer"
										addButtonVariant="outline"
										addButtonClassName="h-8 text-muted-foreground border-dashed"
										onAdd={(userId) => addReviewer(userId)}
										onRemove={(userId) => removeReviewer(userId)}
									/>
								</div>
							</div>

							<Separator />

							{/* Related */}
							<div className="space-y-4">
								<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Related Tickets
								</h4>
								<div className="space-y-2">
									<Button
										variant="ghost"
										className="h-auto p-0 hover:bg-transparent hover:underline justify-start font-normal text-sm"
									>
										<span className="text-muted-foreground mr-2">#1230</span>
										Frontend layout implementation
									</Button>
									<Button
										variant="ghost"
										className="h-auto p-0 hover:bg-transparent hover:underline justify-start font-normal text-sm"
									>
										<span className="text-muted-foreground mr-2">#1228</span>
										API schema verification
									</Button>
								</div>
							</div>

							<Separator />

							{/* Attachments */}
							<div className="space-y-4">
								<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
									Attachments
								</h4>
								<div className="grid gap-2">
									<div className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
										<div className="h-8 w-8 flex items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
											<ImageIcon className="h-4 w-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium truncate">
												screenshot-error.png
											</div>
											<div className="text-xs text-muted-foreground">
												2.4 MB
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
										<div className="h-8 w-8 flex items-center justify-center rounded bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
											<Paperclip className="h-4 w-4" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="text-sm font-medium truncate">
												server-logs.txt
											</div>
											<div className="text-xs text-muted-foreground">
												128 KB
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
