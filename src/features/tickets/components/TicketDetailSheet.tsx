import { useSuspenseQuery } from "@tanstack/react-query";
import {
	Bold,
	Calendar as CalendarIcon,
	ChevronRight,
	Image as ImageIcon,
	Italic,
	Link as LinkIcon,
	List,
	MoreHorizontal,
	Paperclip,
	Send,
	Smile,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAppForm } from "@/hooks/useAppForm";
import { cn } from "@/lib";
import { formatDate } from "@/lib/date";
import { useTicketActions } from "../hooks/useTicketActions";
import type { TicketStatus } from "../types";
import { ticketQueries } from "../utils/queries";
import { ActivityTimeline } from "./ActivityTimeline";
import { TicketStatusSelect } from "./TicketStatusSelect";
import { TicketUserSelector } from "./TicketUserSelector";

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
	const { data: ticket } = useSuspenseQuery(ticketQueries.detail(ticketId));
	const { data: activities } = useSuspenseQuery(
		ticketQueries.activities(ticketId),
	);

	const actions = useTicketActions();

	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const titleForm = useAppForm({
		defaultValues: {
			title: ticket.title,
		},
		onSubmit: async ({ value }) => {
			const trimmedTitle = value.title.trim();
			if (trimmedTitle && trimmedTitle !== ticket.title) {
				actions.update.mutate(
					{ id: ticketId, data: { title: trimmedTitle } },
					{
						onSuccess: () => {
							toast.success("Title updated");
						},
					},
				);
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

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] gap-0 overflow-hidden p-0 sm:max-w-5xl"
			>
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="z-10 flex shrink-0 items-center justify-between gap-4 border-b bg-background px-6 py-3">
						<div className="flex min-w-0 flex-1 items-center gap-4">
							<SheetClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</SheetClose>
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<span className="shrink-0 font-medium text-muted-foreground text-sm">
									[T-{ticket.id.slice(0, 8)}]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<SheetTitle className="m-0 min-w-0 flex-1">
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
												className={`h-auto flex-1 rounded border-transparent bg-transparent px-1 py-0.5 font-semibold text-lg! shadow-none focus-visible:border-input focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-offset-0 ${!isEditingTitle ? "cursor-pointer hover:bg-muted/50" : ""}`}
											/>
										)}
									</titleForm.Field>
								</SheetTitle>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<TicketStatusSelect
								value={ticket.status}
								onValueChange={(value) =>
									actions.updateStatus.mutate({
										id: ticketId,
										status: value as TicketStatus,
									})
								}
							/>
							<Button variant="ghost" size="icon">
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</div>
					</div>

					{/* Body: 2 Columns */}
					<div className="flex flex-1 overflow-hidden">
						{/* Main Column (Left) */}
						<div className="flex w-[65%] min-w-0 flex-1 flex-col bg-background">
							{/* Scrollable Content */}
							<div className="flex-1 overflow-y-auto px-8 py-6">
								{/* Description Section */}
								<div className="mb-8 flex gap-4">
									<Avatar className="mt-1 h-10 w-10">
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
											<span className="text-muted-foreground text-xs">
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

								{/* Timeline */}
								<ActivityTimeline activities={activities} />
							</div>

							{/* Sticky Footer Input */}
							<div className="shrink-0 border-t bg-background p-4">
								<div className="rounded-lg border shadow-sm focus-within:ring-2 focus-within:ring-ring">
									<Textarea
										placeholder="Leave a comment..."
										className="min-h-[80px] resize-none border-0 p-3 text-sm focus-visible:ring-0"
									/>
									<div className="flex items-center justify-between rounded-b-lg border-t bg-muted/20 p-2">
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
											<Separator orientation="vertical" className="mx-1 h-4" />
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
						<div className="w-[35%] min-w-[300px] space-y-8 overflow-y-auto border-l bg-muted/5 p-6">
							{/* Properties */}
							<div className="space-y-6">
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
									Properties
								</h4>

								<div className="space-y-5">
									<Suspense
										fallback={<UserSelectorSkeleton label="Assignees" />}
									>
										<TicketUserSelector
											ticketId={ticket.id}
											projectId={ticket.projectId}
											users={ticket.assignees}
											label="Assignees"
											addButtonLabel="+ Add Assignee"
											addButtonVariant="outline"
											addButtonClassName="h-8 text-muted-foreground border-dashed"
											onAdd={(user) =>
												actions.addAssignee.mutate({
													id: ticketId,
													data: { userId: user.id },
												})
											}
											onRemove={(userId) =>
												actions.removeAssignee.mutate({ id: ticketId, userId })
											}
										/>
									</Suspense>

									{/* Due Date */}
									<div className="space-y-2">
										<span className="font-medium text-muted-foreground text-xs">
											Due Date
										</span>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={"outline"}
													className={cn(
														"h-8 w-full justify-start text-left font-normal",
														!ticket.dueDate && "text-muted-foreground",
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{ticket.dueDate ? (
														formatDate(ticket.dueDate, "long")
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													selected={
														ticket.dueDate
															? new Date(ticket.dueDate)
															: undefined
													}
													onSelect={(date) =>
														actions.update.mutate({
															id: ticketId,
															data: {
																dueDate: date ? date.toISOString() : null,
															},
														})
													}
													initialFocus
													required={false}
												/>
											</PopoverContent>
										</Popover>
									</div>

									<Suspense
										fallback={<UserSelectorSkeleton label="Reviewers" />}
									>
										<TicketUserSelector
											ticketId={ticket.id}
											projectId={ticket.projectId}
											users={ticket.reviewers}
											label="Reviewers"
											addButtonLabel="+ Add Reviewer"
											addButtonVariant="outline"
											addButtonClassName="h-8 text-muted-foreground border-dashed"
											onAdd={(user) =>
												actions.addReviewer.mutate({
													id: ticketId,
													data: { userId: user.id },
												})
											}
											onRemove={(userId) =>
												actions.removeReviewer.mutate({ id: ticketId, userId })
											}
										/>
									</Suspense>
								</div>
							</div>

							<Separator />

							{/* Related */}
							<div className="space-y-4">
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
									Related Tickets
								</h4>
								<div className="space-y-2">
									<Button
										variant="ghost"
										className="h-auto justify-start p-0 font-normal text-sm hover:bg-transparent hover:underline"
									>
										<span className="mr-2 text-muted-foreground">#1230</span>
										Frontend layout implementation
									</Button>
									<Button
										variant="ghost"
										className="h-auto justify-start p-0 font-normal text-sm hover:bg-transparent hover:underline"
									>
										<span className="mr-2 text-muted-foreground">#1228</span>
										API schema verification
									</Button>
								</div>
							</div>

							<Separator />

							{/* Attachments */}
							<div className="space-y-4">
								<h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
									Attachments
								</h4>
								<div className="grid gap-2">
									<div className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50">
										<div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
											<ImageIcon className="h-4 w-4" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="truncate font-medium text-sm">
												screenshot-error.png
											</div>
											<div className="text-muted-foreground text-xs">
												2.4 MB
											</div>
										</div>
									</div>
									<div className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/50">
										<div className="flex h-8 w-8 items-center justify-center rounded bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
											<Paperclip className="h-4 w-4" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="truncate font-medium text-sm">
												server-logs.txt
											</div>
											<div className="text-muted-foreground text-xs">
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

function UserSelectorSkeleton({ label }: { label: string }) {
	return (
		<div className="space-y-2">
			<span className="font-medium text-muted-foreground text-xs">{label}</span>
			<div className="flex min-h-[2.5rem] items-center gap-2">
				<Skeleton className="h-8 w-24 rounded-md" />
			</div>
		</div>
	);
}
