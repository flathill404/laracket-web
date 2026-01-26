import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib";

export const AVATAR_VARIANTS = {
	xs: { size: "h-5 w-5", text: "text-[8px]" },
	sm: { size: "h-6 w-6", text: "text-[10px]" },
	md: { size: "h-8 w-8", text: "text-xs" },
	lg: { size: "h-10 w-10", text: "text-sm" },
	xl: { size: "h-20 w-20", text: "text-xl" },
} as const;

export type AvatarSize = keyof typeof AVATAR_VARIANTS;

export interface UserLike {
	id?: string;
	name?: string | null;
	displayName?: string | null;
	avatarUrl?: string | null;
}

export interface UserAvatarProps {
	user: UserLike;
	size?: AvatarSize;
	className?: string;
}

export function getInitials(user: UserLike): string {
	const name = user.displayName || user.name || "";
	return name.slice(0, 2).toUpperCase();
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
	const { size: sizeClass, text: textClass } = AVATAR_VARIANTS[size];

	return (
		<Avatar className={cn(sizeClass, className)}>
			<AvatarImage
				src={user.avatarUrl ?? undefined}
				alt={user.displayName ?? user.name ?? "User Avatar"}
			/>
			<AvatarFallback className={textClass}>{getInitials(user)}</AvatarFallback>
		</Avatar>
	);
}
