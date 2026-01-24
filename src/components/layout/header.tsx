import { Bell, HelpCircle, LogOut, Search } from "lucide-react";
import type { z } from "zod";
import { UserAvatar } from "@/components/common/user-avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { userSchema } from "@/features/auth/types";

type User = z.infer<typeof userSchema>;

interface HeaderProps {
	user: User;
	isVerified: boolean;
	logout: () => void;
}

export function Header({ user, isVerified, logout }: HeaderProps) {
	return (
		<header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6">
			<div className="flex items-center gap-2 font-semibold">
				<img src="/logo.svg" alt="Laracket" className="h-8 w-8" />
				<span className="hidden sm:inline-block">Laracket</span>
			</div>

			<div className="flex w-full max-w-sm items-center space-x-2">
				{isVerified && (
					<div className="relative w-full">
						<Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search tickets..."
							className="h-9 w-full rounded-md bg-muted pl-9 md:w-80 lg:w-96"
						/>
					</div>
				)}
			</div>

			<div className="ml-auto flex items-center gap-4">
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<Bell className="h-4 w-4" />
					<span className="sr-only">Notifications</span>
				</Button>
				<Button variant="ghost" size="icon" className="h-8 w-8">
					<HelpCircle className="h-4 w-4" />
					<span className="sr-only">Help</span>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<UserAvatar user={user} size="md" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end" forceMount>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="font-medium text-sm leading-none">{user.name}</p>
								<p className="text-muted-foreground text-xs leading-none">
									{user.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => logout()}>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
