import { cn } from "@/lib";
import { formatDateLocale, isOverdue } from "@/lib/date";

export function DueDateCell({
	dueDate,
}: {
	dueDate: string | null | undefined;
}) {
	if (!dueDate) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}

	const formatted = formatDateLocale(dueDate);
	const isPastDue = isOverdue(dueDate);

	return (
		<span
			className={cn("text-sm", isPastDue && "font-medium text-destructive")}
		>
			{formatted}
		</span>
	);
}
