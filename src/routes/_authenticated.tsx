import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";
import {
	Bell,
	Files,
	Folder,
	HelpCircle,
	Inbox,
	LayoutDashboard,
	Search,
	Settings,
	Users,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userQueryOptions } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.ensureQueryData(userQueryOptions);
		if (!user) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Global Header */}
			<header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-6">
				<div className="flex items-center gap-2 font-semibold">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						{/* Logo Placeholder */}
						<span className="text-lg font-bold">L</span>
					</div>
					<span className="hidden sm:inline-block">Laracket</span>
				</div>

				<div className="flex w-full max-w-sm items-center space-x-2">
					<div className="relative w-full">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search tickets..."
							className="h-9 w-full rounded-md bg-muted pl-9 md:w-[300px] lg:w-[336px]"
						/>
					</div>
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
					<div className="h-8 w-8 rounded-full bg-muted">
						<Avatar className="h-8 w-8">
							<AvatarImage src="/placeholder-user.jpg" alt="User" />
							<AvatarFallback>U</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</header>

			{/* Main Body */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Sidebar */}
				<aside className="hidden w-[240px] flex-col border-r bg-muted/10 md:flex">
					<div className="flex-1 overflow-auto py-4">
						<nav className="flex flex-col gap-1 px-4 text-sm font-medium">
							<Link
								to="/dashboard"
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<LayoutDashboard className="h-4 w-4" />
								Dashboard
							</Link>
							<Link
								to="/dashboard"
								className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
							>
								<Inbox className="h-4 w-4" />
								My Work
							</Link>
							<Link
								to="/dashboard"
								className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
							>
								<Files className="h-4 w-4" />
								All Tickets
							</Link>

							<Accordion type="multiple" className="w-full">
								<AccordionItem value="projects" className="border-b-0">
									<AccordionTrigger className="py-2 text-muted-foreground hover:text-primary hover:no-underline">
										<div className="flex items-center gap-3 px-3">
											<Folder className="h-4 w-4" />
											Projects
										</div>
									</AccordionTrigger>
									<AccordionContent className="pb-0">
										<div className="flex flex-col gap-1 pl-9">
											{["Website Redesign", "Mobile App", "Compliance"].map(
												(project) => (
													<Link
														key={project}
														to="/dashboard"
														className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
													>
														{project}
													</Link>
												),
											)}
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="teams" className="border-b-0">
									<AccordionTrigger className="py-2 text-muted-foreground hover:text-primary hover:no-underline">
										<div className="flex items-center gap-3 px-3">
											<Users className="h-4 w-4" />
											Teams
										</div>
									</AccordionTrigger>
									<AccordionContent className="pb-0">
										<div className="flex flex-col gap-1 pl-9">
											{["Engineering", "Design", "Marketing"].map((team) => (
												<Link
													key={team}
													to="/dashboard"
													className="rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
												>
													{team}
												</Link>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</nav>
					</div>

					<div className="mt-auto border-t p-4">
						<Link
							to="/dashboard"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary"
						>
							<Settings className="h-4 w-4" />
							Settings
						</Link>
					</div>
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
