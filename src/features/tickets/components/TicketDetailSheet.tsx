import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
	Bold,
	ChevronDown,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { fetchTicket } from "../api/tickets";

// Helper to define types for the status based on the API
const getStatusColor = (status: string) => {
	switch (status) {
		case "open":
		case "reopened":
			return "text-green-500 fill-green-500";
		case "in_progress":
			return "text-yellow-500 fill-yellow-500";
		case "resolved":
		case "closed":
			return "text-slate-500 fill-slate-500";
		case "in_review":
			return "text-blue-500 fill-blue-500";
		default:
			return "text-slate-500 fill-slate-500";
	}
};

const getStatusLabel = (status: string) => {
	return status
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const ticketQuery = (ticketId: string) =>
	queryOptions({
		queryKey: ["tickets", ticketId],
		queryFn: () => fetchTicket(ticketId),
	});

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
	const { data: ticket } = useSuspenseQuery(ticketQuery(ticketId));

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] sm:max-w-5xl p-0 gap-0 overflow-hidden"
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-between px-6 py-3 border-b shrink-0 bg-background z-10">
						<div className="flex items-center gap-4">
							<SheetClose asChild>
								<Button
									variant="ghost"
									size="icon"
									className="text-muted-foreground hover:text-foreground"
								>
									<ChevronRight className="h-5 w-5" />
								</Button>
							</SheetClose>
							<div className="flex items-center gap-3">
								<span className="text-sm font-medium text-muted-foreground">
									[T-{ticket.id.slice(0, 8)}]
								</span>
								<Separator orientation="vertical" className="h-4" />
								<SheetTitle className="text-lg font-semibold m-0">
									{ticket.title}
								</SheetTitle>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="gap-2 text-green-700 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-800 hover:border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900"
							>
								<Circle
									className={`h-2 w-2 ${getStatusColor(ticket.status)}`}
								/>
								{getStatusLabel(ticket.status)}
								<ChevronDown className="h-3 w-3 opacity-50" />
							</Button>
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
								<div className="relative pl-4 space-y-8 before:absolute before:top-0 before:bottom-0 before:left-[19px] before:w-[2px] before:bg-muted">
									{/* Activity 1 */}
									<div className="relative pl-8">
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
									<div className="relative pl-8">
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
									<div className="space-y-2">
										<span className="text-xs font-medium text-muted-foreground">
											Assignees
										</span>
										<div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center">
											{ticket.assignees.length > 0 ? (
												ticket.assignees.map((assignee) => (
													<div
														key={assignee.id}
														className="flex items-center gap-2 bg-background border px-2 py-1 rounded-md shadow-sm"
													>
														<Avatar className="h-5 w-5">
															<AvatarImage
																src={assignee.avatarUrl ?? undefined}
															/>
															<AvatarFallback className="text-[10px]">
																{assignee.name.slice(0, 2).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm font-medium">
															{assignee.name}
														</span>
													</div>
												))
											) : (
												<Button
													variant="outline"
													size="sm"
													className="h-8 text-muted-foreground border-dashed"
												>
													+ Add Assignee
												</Button>
											)}
										</div>
									</div>

									<div className="space-y-2">
										<span className="text-xs font-medium text-muted-foreground">
											Priority
										</span>
										<div>
											<Button
												variant="outline"
												size="sm"
												className="h-8 justify-start gap-2 font-normal"
											>
												<div className="h-2 w-2 rounded-full bg-red-500" />
												High
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<span className="text-xs font-medium text-muted-foreground">
											Reviewers
										</span>
										<div>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 px-0 text-muted-foreground hover:text-foreground"
											>
												+ Add Reviewer
											</Button>
										</div>
									</div>

									<div className="space-y-2">
										<span className="text-xs font-medium text-muted-foreground">
											Labels
										</span>
										<div className="flex flex-wrap gap-1.5">
											<div className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800">
												frontend
											</div>
											<div className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800">
												bug
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="h-5 w-5 rounded-full p-0"
											>
												<span className="text-lg leading-none mb-1">+</span>
											</Button>
										</div>
									</div>
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
