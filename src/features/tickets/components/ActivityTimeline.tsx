import type { Activity } from "../types";
import { ActivityItem } from "./ActivityItem";

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
