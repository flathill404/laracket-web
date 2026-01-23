import { cn } from "@/utils";

export function DueDateCell({
	dueDate,
}: {
	dueDate: string | null | undefined;
}) {
	if (!dueDate) {
		return <span className="text-muted-foreground text-sm">—</span>;
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
			className={cn("text-sm", isPastDue && "font-medium text-destructive")}
		>
			{formatted}
		</span>
	);
}
