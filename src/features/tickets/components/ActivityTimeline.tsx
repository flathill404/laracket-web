import { UserAvatar } from "@/components/common/user-avatar";
import { formatRelativeTime } from "@/lib/date";
import type { Activity } from "../types";
import { getStatusLabel } from "../utils/status";

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
			<UserAvatar
				user={activity.user}
				size="lg"
				className="absolute top-0 left-0 z-10 border-2 border-background"
			/>
			<div className="pt-2">
				<span className="font-semibold text-sm">
					{activity.user.displayName}
				</span>{" "}
				<span className="text-muted-foreground text-sm">
					{getActivityDescription(activity)}
				</span>
				<span className="ml-2 text-muted-foreground text-xs">
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
