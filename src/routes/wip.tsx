import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, HardHat, Rocket } from "lucide-react";
import { useId } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/wip")({
	component: WipPage,
});

function WipPage() {
	const turboModeId = useId();
	return (
		<div className="flex min-h-svh w-full flex-col items-center justify-center bg-background p-6 md:p-10">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
						WORK IN PROGRESS
					</h1>
					<div className="flex gap-2">
						<Badge variant="destructive" className="uppercase">
							Alpha Build
						</Badge>
						<Badge variant="secondary" className="uppercase">
							Experimental
						</Badge>
						<Badge variant="outline" className="uppercase">
							Unstable
						</Badge>
					</div>
				</div>

				<Alert variant="destructive">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Hazardous Code Construction</AlertTitle>
					<AlertDescription>
						You have entered a designated hard-hat area. Features may shift,
						break, or explode without warning.
					</AlertDescription>
				</Alert>

				<Card className="w-full border-2 border-dashed shadow-2xl">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<CardTitle className="flex items-center gap-2">
									<HardHat className="h-6 w-6" />
									System Module: <span className="text-primary">COOL_PAGE</span>
								</CardTitle>
								<CardDescription>
									Compiling aesthetic assets and mock functionality...
								</CardDescription>
							</div>
							<Spinner className="h-6 w-6 text-primary" />
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm text-muted-foreground">
								<span>Loading Core Systems...</span>
								<span>78%</span>
							</div>
							<div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-secondary">
								<div className="h-full w-[40%] bg-primary animate-pulse" />
								<div className="h-full w-[20%] bg-primary/80 animate-pulse delay-75" />
								<div className="h-full w-[18%] bg-primary/60 animate-pulse delay-150" />
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Skeleton className="h-4 w-[80%]" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-[60%]" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full delay-100" />
								<Skeleton className="h-4 w-[90%] delay-100" />
								<Skeleton className="h-4 w-[75%] delay-100" />
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="font-semibold leading-none tracking-tight">
								Experimental Controls
							</h3>

							<div className="flex items-center justify-between rounded-lg border p-4">
								<div className="space-y-0.5">
									<Label htmlFor={turboModeId}>Turbo Mode</Label>
									<p className="text-sm text-muted-foreground">
										Enable unsafe rendering speeds.
									</p>
								</div>
								<Switch id={turboModeId} checked />
							</div>

							<div className="flex items-center space-x-2">
								<Input
									placeholder="Enter secret cheat code..."
									className="font-mono"
								/>
								<Button variant="outline" size="icon">
									<Rocket className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</CardContent>
					<CardFooter className="bg-muted/50 px-6 py-4">
						<p className="text-xs text-muted-foreground font-mono">
							{"BUILD_ID: 9a8f7b6c // COMMIT: pending // BLAME: @flathill404"}
						</p>
					</CardFooter>
				</Card>

				<div className="text-center text-sm text-muted-foreground">
					<p>
						Estimated time to completion:{" "}
						<span className="font-mono">UNKNOWN</span>
					</p>
				</div>
			</div>
		</div>
	);
}
