import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Plus,
	Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_auth/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Overview of your project's performance and recent activities.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button>
						<Plus className="mr-2 h-4 w-4" /> New Project
					</Button>
				</div>
			</div>

			{/* Stats Section */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">$45,231.89</div>
						<p className="text-xs text-muted-foreground">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+2350</div>
						<p className="text-xs text-muted-foreground">
							+180.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+12,234</div>
						<p className="text-xs text-muted-foreground">
							+19% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Now</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+573</div>
						<p className="text-xs text-muted-foreground">
							+201 since last hour
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Area */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				{/* Recent Sales / Activity */}
				<Card className="col-span-4">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
						<CardDescription>You made 265 sales this month.</CardDescription>
					</CardHeader>
					<CardContent>
						<RecentSales />
					</CardContent>
				</Card>

				{/* Recent Activity / System Status or something else */}
				<Card className="col-span-3">
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
						<CardDescription>
							Latest actions performed across the system.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-8">
							<div className="flex items-center">
								<span className="relative flex h-2 w-2 mr-4">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
								</span>
								<div className="ml-4 space-y-1">
									<p className="text-sm font-medium leading-none">
										System System
									</p>
									<p className="text-sm text-muted-foreground">
										All systems operational
									</p>
								</div>
							</div>
							{/* Mock items */}
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center">
									<div className="flex h-9 w-9 items-center justify-center rounded-full border bg-background">
										<Activity className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="ml-4 space-y-1">
										<p className="text-sm font-medium leading-none">
											New user registered
										</p>
										<p className="text-sm text-muted-foreground">
											uid: user_{i}123
										</p>
									</div>
									<div className="ml-auto font-medium">Just now</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function RecentSales() {
	return (
		<div className="space-y-8">
			<div className="flex items-center">
				<div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
					<span className="text-xs font-bold">OM</span>
				</div>
				<div className="ml-4 space-y-1">
					<p className="text-sm font-medium leading-none">Olivia Martin</p>
					<p className="text-sm text-muted-foreground">
						olivia.martin@email.com
					</p>
				</div>
				<div className="ml-auto font-medium">+$1,999.00</div>
			</div>
			<div className="flex items-center">
				<div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
					<span className="text-xs font-bold">JL</span>
				</div>
				<div className="ml-4 space-y-1">
					<p className="text-sm font-medium leading-none">Jackson Lee</p>
					<p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
				</div>
				<div className="ml-auto font-medium">+$39.00</div>
			</div>
			<div className="flex items-center">
				<div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
					<span className="text-xs font-bold">IN</span>
				</div>
				<div className="ml-4 space-y-1">
					<p className="text-sm font-medium leading-none">Isabella Nguyen</p>
					<p className="text-sm text-muted-foreground">
						isabella.nguyen@email.com
					</p>
				</div>
				<div className="ml-auto font-medium">+$299.00</div>
			</div>
			<div className="flex items-center">
				<div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
					<span className="text-xs font-bold">WK</span>
				</div>
				<div className="ml-4 space-y-1">
					<p className="text-sm font-medium leading-none">William Kim</p>
					<p className="text-sm text-muted-foreground">will@email.com</p>
				</div>
				<div className="ml-auto font-medium">+$99.00</div>
			</div>
			<div className="flex items-center">
				<div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
					<span className="text-xs font-bold">SD</span>
				</div>
				<div className="ml-4 space-y-1">
					<p className="text-sm font-medium leading-none">Sofia Davis</p>
					<p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
				</div>
				<div className="ml-auto font-medium">+$39.00</div>
			</div>
		</div>
	);
}
