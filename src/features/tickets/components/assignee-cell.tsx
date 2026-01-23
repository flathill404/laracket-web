import {
	UserAvatarStack,
	UserAvatarWithName,
} from "@/components/common/user-avatar";
import type { Ticket } from "./types";

export function AssigneeCell({
	assignees,
}: {
	assignees: Ticket["assignees"];
}) {
	if (assignees.length === 0) {
		return <span className="text-muted-foreground text-sm">Unassigned</span>;
	}

	if (assignees.length === 1) {
		return (
			<UserAvatarWithName
				user={assignees[0]}
				size="sm"
				nameClassName="text-muted-foreground text-sm font-normal"
			/>
		);
	}

	return <UserAvatarStack users={assignees} size="sm" max={3} />;
}
