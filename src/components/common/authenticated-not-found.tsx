import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthenticatedNotFound() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
			<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
				<AlertCircle className="h-10 w-10 text-muted-foreground" />
			</div>

			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
				<p className="text-muted-foreground max-w-sm">
					Sorry, we couldn't find the page you're looking for. It might have
					been moved or doesn't exist.
				</p>
			</div>

			<div className="flex gap-4">
				<Button asChild variant="default">
					<Link to="/dashboard">Go to Dashboard</Link>
				</Button>
				<Button asChild variant="outline">
					<Link to="..">Go Back</Link>
				</Button>
			</div>
		</div>
	);
}
