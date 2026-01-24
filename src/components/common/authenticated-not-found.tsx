import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function AuthenticatedNotFound() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<AlertCircle />
				</EmptyMedia>
				<EmptyTitle>Page not found</EmptyTitle>
				<EmptyDescription>
					Sorry, we couldn't find the page you're looking for. It might have
					been moved or doesn't exist.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<div className="flex gap-4">
					<Button asChild variant="default">
						<Link to="/dashboard">Go to Dashboard</Link>
					</Button>
					<Button asChild variant="outline">
						<Link to="..">Go Back</Link>
					</Button>
				</div>
			</EmptyContent>
		</Empty>
	);
}
