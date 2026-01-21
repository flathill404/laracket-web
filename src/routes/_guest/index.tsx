import { createFileRoute, Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_guest/")({ component: LandingPage });

function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<header className="px-6 h-14 flex items-center justify-between border-b">
				<div className="flex items-center gap-2 font-semibold">
					<img src="/logo.svg" alt="Laracket" className="w-6 h-6" />
					<span>Laracket</span>
				</div>
				<nav className="flex items-center gap-4">
					<Button variant="ghost" asChild>
						<Link to="/login">Sign In</Link>
					</Button>
					<Button asChild>
						<Link to="/login">Sign Up</Link>
					</Button>
				</nav>
			</header>

			{/* Hero Section */}
			<main className="flex-1">
				<section className="w-full py-24 md:py-32 lg:py-40 xl:py-48 bg-muted/40">
					<div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
						<div className="space-y-4 max-w-3xl">
							<h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
								Manage Your Tickets with{" "}
								<span className="text-primary">Laracket</span>
							</h1>
							<p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
								The ultimate ticket management SaaS platform. Streamline your
								workflow, track issues, and collaborate seamlessly.
							</p>
						</div>
						<div className="flex flex-col sm:flex-row gap-4">
							<Button size="lg" className="h-12 px-8" asChild>
								<Link to="/login">Get Started</Link>
							</Button>
							<Button size="lg" variant="outline" className="h-12 px-8" asChild>
								<a
									href="https://github.com/flathill404/laracket-web"
									target="_blank"
									rel="noreferrer"
								>
									<Github className="mr-2 h-4 w-4" />
									GitHub
								</a>
							</Button>
						</div>
					</div>
				</section>

				{/* Features / Info Section (Optional placeholder for "Coolness") */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 mx-auto">
						<div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
							<div className="space-y-4">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Performance
								</div>
								<h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
									Fast, Reliable, and Secure
								</h2>
								<p className="mx-auto max-w-2xl text-muted-foreground md:text-xl/relaxed">
									Built with modern technologies to ensure your team stays
									productive without interruptions.
								</p>
							</div>
							<div className="flex flex-col items-start space-y-4">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
									Open Source
								</div>
								<p className="mx-auto max-w-2xl text-muted-foreground md:text-xl/relaxed">
									Laracket is open source. You can contribute to the project or
									host it yourself.
								</p>
								<div className="flex gap-4">
									<Button variant="outline" asChild>
										<a
											href="https://github.com/flathill404/laracket-web"
											target="_blank"
											rel="noreferrer"
										>
											<Github className="mr-2 h-4 w-4" />
											Frontend
										</a>
									</Button>
									<Button variant="outline" asChild>
										<a
											href="https://github.com/flathill404/laracket"
											target="_blank"
											rel="noreferrer"
										>
											<Github className="mr-2 h-4 w-4" />
											Backend
										</a>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-muted-foreground">
					&copy; 2026 flathill404. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link className="text-xs hover:underline underline-offset-4" to="/">
						Terms of Service
					</Link>
					<Link className="text-xs hover:underline underline-offset-4" to="/">
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
