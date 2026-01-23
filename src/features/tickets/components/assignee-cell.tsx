import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Ticket } from "./types";

export function AssigneeCell({ assignees }: { assignees: Ticket["assignees"] }) {
	if (assignees.length === 0) {
		return <span className="text-sm text-muted-foreground">Unassigned</span>;
	}

	if (assignees.length === 1) {
		const assignee = assignees[0];
		return (
			<div className="flex items-center gap-2">
				<Avatar className="h-6 w-6">
					<AvatarImage src={assignee.avatarUrl ?? undefined} />
					<AvatarFallback className="text-[10px]">
						{assignee.name.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<span className="text-sm text-muted-foreground">{assignee.name}</span>
			</div>
		);
	}

	// Multiple assignees: Show avatars only, max 3
	return (
		<div className="flex items-center -space-x-2">
			{assignees.slice(0, 3).map((assignee) => (
				<Avatar key={assignee.id} className="h-6 w-6">
					<AvatarImage src={assignee.avatarUrl ?? undefined} />
					<AvatarFallback className="text-[10px]">
						{assignee.name.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			))}
			{assignees.length > 3 && (
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
					+{assignees.length - 3}
				</div>
			)}
		</div>
	);
}
