import { Link, type LinkProps } from "@tanstack/react-router";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib";

type SidebarLinkProps = Omit<LinkProps, "children" | "className"> & {
	icon?: ElementType;
	className?: string;
	children?: ReactNode;
};

export function SidebarLink({
	icon: Icon,
	className,
	children,
	...props
}: SidebarLinkProps) {
	return (
		<Link
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary [&.active]:bg-muted [&.active]:text-primary",
				className,
			)}
			{...props}
		>
			{Icon && <Icon className="h-4 w-4" />}
			{children}
		</Link>
	);
}
