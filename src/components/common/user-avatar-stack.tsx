import type { ReactNode } from "react";
import { cn } from "@/lib";
import {
	AVATAR_VARIANTS,
	type AvatarSize,
	getInitials,
	UserAvatar,
	type UserLike,
} from "./user-avatar";

const MAX_VISIBLE_AVATARS = 3;

interface UserAvatarStackProps {
	users: UserLike[];
	max?: number;
	size?: AvatarSize;
	className?: string;
	emptyContent?: ReactNode;
}

export function UserAvatarStack({
	users,
	max = MAX_VISIBLE_AVATARS,
	size = "sm",
	className,
	emptyContent = <span className="text-muted-foreground text-sm">—</span>,
}: UserAvatarStackProps) {
	if (users.length === 0) {
		return <>{emptyContent}</>;
	}

	const visibleUsers = users.slice(0, max);
	const remainingCount = users.length - max;
	const { size: sizeClass, text: textClass } = AVATAR_VARIANTS[size];

	return (
		<div className={cn("flex items-center -space-x-2", className)}>
			{visibleUsers.map((user) => (
				<UserAvatar
					key={user.id ?? getInitials(user)}
					user={user}
					size={size}
					className="ring-2 ring-background"
				/>
			))}
			{remainingCount > 0 && (
				<div
					className={cn(
						"flex items-center justify-center rounded-full bg-muted font-medium ring-2 ring-background",
						sizeClass,
						textClass,
					)}
				>
					+{remainingCount}
				</div>
			)}
		</div>
	);
}
