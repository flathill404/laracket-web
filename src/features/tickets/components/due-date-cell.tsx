import { cn } from "@/utils";

export function DueDateCell({ dueDate }: { dueDate: string | null | undefined }) {
	if (!dueDate) {
		return <span className="text-sm text-muted-foreground">—</span>;
	}
	const date = new Date(dueDate);
	const formatted = date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	const isPastDue = date < new Date();
	return (
		<span
			className={cn("text-sm", isPastDue && "text-destructive font-medium")}
		>
			{formatted}
		</span>
	);
}
