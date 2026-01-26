import type { ReactNode } from "react";

interface GuestFormLayoutProps {
	children: ReactNode;
}

export function GuestFormLayout({ children }: GuestFormLayoutProps) {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm flex-col gap-6">{children}</div>
		</div>
	);
}
