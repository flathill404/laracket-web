import { Link } from "@tanstack/react-router";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DefaultNotFound() {
	return (
		<div className="fade-in flex min-h-screen animate-in flex-col items-center justify-center p-4 text-center duration-500">
			<div className="relative flex justify-center">
				<div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
				<FileQuestion className="relative z-10 h-24 w-24 text-primary" />
			</div>

			<div className="mt-8 space-y-2">
				<h1 className="bg-linear-to-r from-primary to-primary/50 bg-clip-text font-black text-8xl text-transparent">
					404
				</h1>
				<h2 className="font-bold text-2xl tracking-tight">Page Not Found</h2>
				<p className="max-w-[500px] text-balance text-muted-foreground">
					Sorry, we couldn't find the page you're looking for. It might have
					been moved or doesn't exist.
				</p>
			</div>

			<Button asChild size="lg" className="mt-8 gap-2">
				<Link to="/">
					<Home className="h-4 w-4" />
					Go Home
				</Link>
			</Button>
		</div>
	);
}
