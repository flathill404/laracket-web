import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Activity } from "../api/activities";
import { formatRelativeTime } from "../lib/date-utils";
import { getStatusLabel } from "../utils";

function getActivityDescription(activity: Activity): string {
	if (activity.type === "created") {
		return "created this ticket";
	}

	if (activity.type === "updated" && activity.payload) {
		const payload = activity.payload as {
			status?: { from: string; to: string };
		};
		if (payload.status) {
			return `changed status from ${getStatusLabel(payload.status.from)} to ${getStatusLabel(payload.status.to)}`;
		}
	}

	return "updated this ticket";
}

interface ActivityItemProps {
	activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
	return (
		<div className="relative pl-14">
			<Avatar className="absolute left-0 top-0 h-10 w-10 border-2 border-background z-10">
				<AvatarImage src={activity.user.avatarUrl ?? undefined} />
				<AvatarFallback>
					{activity.user.name.slice(0, 2).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="pt-2">
				<span className="font-semibold text-sm">
					{activity.user.displayName}
				</span>{" "}
				<span className="text-sm text-muted-foreground">
					{getActivityDescription(activity)}
				</span>
				<span className="ml-2 text-xs text-muted-foreground">
					{formatRelativeTime(activity.createdAt)}
				</span>
			</div>
		</div>
	);
}

interface ActivityTimelineProps {
	activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
	return (
		<div className="relative space-y-8 before:absolute before:top-0 before:bottom-0 before:left-[19px] before:w-[2px] before:bg-muted">
			{activities.map((activity) => (
				<ActivityItem key={activity.id} activity={activity} />
			))}
		</div>
	);
}
