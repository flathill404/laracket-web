import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils";

const AVATAR_SIZES = {
	xs: "h-5 w-5",
	sm: "h-6 w-6",
	md: "h-8 w-8",
	lg: "h-10 w-10",
	xl: "h-20 w-20",
} as const;

const FALLBACK_TEXT_SIZES = {
	xs: "text-[8px]",
	sm: "text-[10px]",
	md: "text-xs",
	lg: "text-sm",
	xl: "text-xl",
} as const;

type AvatarSize = keyof typeof AVATAR_SIZES;

interface UserLike {
	id?: string;
	name?: string | null;
	displayName?: string | null;
	avatarUrl?: string | null;
}

interface UserAvatarProps {
	user: UserLike;
	size?: AvatarSize;
	className?: string;
}

function getInitials(user: UserLike): string {
	const name = user.displayName || user.name || "";
	return name.slice(0, 2).toUpperCase();
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
	return (
		<Avatar className={cn(AVATAR_SIZES[size], className)}>
			<AvatarImage src={user.avatarUrl ?? undefined} />
			<AvatarFallback className={FALLBACK_TEXT_SIZES[size]}>
				{getInitials(user)}
			</AvatarFallback>
		</Avatar>
	);
}

interface UserAvatarWithNameProps extends UserAvatarProps {
	showSecondaryName?: boolean;
	secondaryName?: string;
	nameClassName?: string;
}

export function UserAvatarWithName({
	user,
	size = "md",
	className,
	showSecondaryName,
	secondaryName,
	nameClassName,
}: UserAvatarWithNameProps) {
	const primaryName = user.displayName || user.name || "";
	const secondary = secondaryName || user.name;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<UserAvatar user={user} size={size} />
			<div className="flex flex-col">
				<span className={cn("font-medium text-sm leading-none", nameClassName)}>
					{primaryName}
				</span>
				{showSecondaryName && secondary && (
					<span className="text-muted-foreground text-xs">{secondary}</span>
				)}
			</div>
		</div>
	);
}

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
						AVATAR_SIZES[size],
						FALLBACK_TEXT_SIZES[size],
					)}
				>
					+{remainingCount}
				</div>
			)}
		</div>
	);
}
