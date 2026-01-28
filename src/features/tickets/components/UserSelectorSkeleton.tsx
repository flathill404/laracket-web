import { Skeleton } from "@/components/ui/skeleton";

export function UserSelectorSkeleton({ label }: { label: string }) {
	return (
		<div className="space-y-2">
			<span className="font-medium text-muted-foreground text-xs">{label}</span>
			<div className="flex min-h-[2.5rem] items-center gap-2">
				<Skeleton className="h-8 w-24 rounded-md" />
			</div>
		</div>
	);
}
