import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpDown, Circle, Plus, Search } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	return (
		<div className="flex flex-col h-full bg-background">
			{/* Page Header */}
			<div className="flex items-center justify-between border-b px-6 py-5">
				<h1 className="text-2xl font-semibold tracking-tight">My Work</h1>
				<Button>
					<Plus className="mr-2 h-4 w-4" /> New Ticket
				</Button>
			</div>

			{/* Control Bar */}
			<div className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Filter tickets..."
							className="h-9 w-full pl-9"
						/>
					</div>
				</div>

				<div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
					<div className="flex items-center rounded-lg bg-muted p-1">
						<Button
							variant="ghost"
							size="sm"
							className="rounded-md bg-background px-3 py-1 text-xs font-medium shadow-sm"
						>
							All
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-background/50"
						>
							Unassigned
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-background/50"
						>
							In Progress
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="rounded-md px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-background/50"
						>
							Done
						</Button>
					</div>

					<Separator orientation="vertical" className="mx-2 h-6" />

					<Select defaultValue="newest">
						<SelectTrigger className="h-9 w-[140px] border-dashed border-zinc-300 shadow-sm">
							<div className="flex items-center gap-2 text-xs">
								<ArrowUpDown className="h-3.5 w-3.5" />
								<SelectValue placeholder="Sort by" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="newest">Newest</SelectItem>
							<SelectItem value="oldest">Oldest</SelectItem>
							<SelectItem value="priority">Priority</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Content List View (Placeholder) */}
			<div className="flex-1 overflow-auto bg-muted/5 p-6">
				<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
					{/* Table Header Placeholder */}
					<div className="grid grid-cols-[1fr_100px_140px_140px] items-center gap-4 border-b px-6 py-3 text-xs font-medium text-muted-foreground">
						<div>Subject</div>
						<div>Status</div>
						<div>Priority</div>
						<div>Assignee</div>
					</div>

					{/* Ticket Rows Placeholder */}
					<div className="divide-y">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="grid grid-cols-[1fr_100px_140px_140px] items-center gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
							>
								<div className="flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<span className="font-medium">
											[T-{1000 + i}] Login page authentication error
										</span>
										{i === 1 && (
											<span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80">
												Urgent
											</span>
										)}
									</div>
									<span className="text-xs text-muted-foreground line-clamp-1">
										User reported that they cannot login when using the legacy
										portal...
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Circle className="h-3 w-3 fill-yellow-500 text-yellow-500" />
									<span className="text-sm">In Progress</span>
								</div>
								<div className="text-sm text-muted-foreground">High</div>
								<div className="flex items-center gap-2">
									<div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
										JD
									</div>
									<span className="text-sm text-muted-foreground">
										John Doe
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="border-t p-4 text-center text-xs text-muted-foreground">
						Showing 6 of 24 tickets
					</div>
				</div>
			</div>
		</div>
	);
}
