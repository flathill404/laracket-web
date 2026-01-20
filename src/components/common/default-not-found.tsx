import { Link } from "@tanstack/react-router";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DefaultNotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center animate-in fade-in duration-500">
			<div className="space-y-6 max-w-md w-full">
				<div className="relative flex justify-center">
					<div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
					<FileQuestion className="h-24 w-24 text-primary relative z-10" />
				</div>

				<div className="space-y-2">
					<h1 className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/50">
						404
					</h1>
					<h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
					<p className="text-muted-foreground">
						Sorry, we couldn't find the page you're looking for. It might have
						been moved or doesn't exist.
					</p>
				</div>

				<div className="pt-4">
					<Button asChild size="lg" className="gap-2">
						<Link to="/">
							<Home className="h-4 w-4" />
							Go Home
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
