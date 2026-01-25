import { cn } from "@/lib";
import { UserAvatar, type UserAvatarProps } from "./user-avatar";

export interface UserAvatarWithNameProps extends UserAvatarProps {
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
