import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
	return (
		<aside className="hidden w-64 flex-col border-r bg-muted/10 md:flex">
			<div className="flex-1 overflow-auto py-4">
				<nav className="flex flex-col gap-1 px-4">
					{/* Static links skeleton */}
					<Skeleton className="h-9 w-full rounded-md" />
					<Skeleton className="h-9 w-full rounded-md" />
					<Skeleton className="h-9 w-full rounded-md" />

					{/* Sections skeleton */}
					<div className="mt-4 space-y-4">
						{Array.from({ length: 3 }).map((_, i) => (
							<div key={`section-${i.toString()}`} className="space-y-2">
								<Skeleton className="h-8 w-full rounded-md" />
								<div className="space-y-1 pl-2">
									<Skeleton className="h-7 w-3/4 rounded-md" />
									<Skeleton className="h-7 w-2/3 rounded-md" />
								</div>
							</div>
						))}
					</div>
				</nav>
			</div>

			<div className="mt-auto border-t p-4">
				<Skeleton className="h-9 w-full rounded-md" />
			</div>
		</aside>
	);
}
