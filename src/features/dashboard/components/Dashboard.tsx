import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-8">
			{/* Header Section */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Overview of your project's performance and recent activities.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline">Customize</Button>
				</div>
			</div>

			{/* Stats Section */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Total Tickets</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">142</div>
						<p className="text-muted-foreground text-xs">
							+20.1% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Completed</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">48</div>
						<p className="text-muted-foreground text-xs">
							+12% from last month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Open</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">94</div>
						<p className="text-muted-foreground text-xs">+7% from last month</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Urgent</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">3</div>
						<p className="text-muted-foreground text-xs">+1 since last hour</p>
					</CardContent>
				</Card>
			</div>

			{/* Todo: Future Widget Area */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
				<div className="col-span-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					Widget Area (Chart)
				</div>
				<div className="col-span-3 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
					Widget Area (Recent Activity)
				</div>
			</div>
		</div>
	);
}
