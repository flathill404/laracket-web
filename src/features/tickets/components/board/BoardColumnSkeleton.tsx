import { Skeleton } from "@/components/ui/skeleton";

export function BoardColumnSkeleton() {
	return (
		<div className="flex h-full min-w-[280px] flex-1 flex-col rounded-lg border bg-muted/30">
			<div className="flex items-center justify-between border-b p-4 pb-2">
				<div className="flex items-center gap-2">
					<Skeleton className="h-3 w-3 rounded-full" />
					<Skeleton className="h-4 w-20" />
				</div>
				<Skeleton className="h-3 w-6" />
			</div>
			<div className="flex-1 space-y-2 p-2">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton
						key={`board-skeleton-${i.toString()}`}
						className="h-24 w-full rounded-lg"
					/>
				))}
			</div>
		</div>
	);
}
