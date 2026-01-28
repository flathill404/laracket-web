import { Skeleton } from "@/components/ui/skeleton";

export function CreateTicketDrawerSkeleton() {
	return (
		<div className="flex h-full flex-col">
			<div className="flex shrink-0 items-center gap-4 border-b bg-background px-6 py-3">
				<Skeleton className="h-9 w-9 rounded-md" />
				<Skeleton className="h-7 flex-1" />
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex w-[65%] flex-1 flex-col p-8">
					<Skeleton className="h-[300px] w-full" />
				</div>
				<div className="w-[35%] min-w-[300px] space-y-6 border-l p-6">
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		</div>
	);
}
