import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { S3Panel } from "./localstack/S3Panel";
import { SesPanel } from "./localstack/SesPanel";

type LocalstackHealth = {
	services: Record<string, "running" | "disabled" | "available">;
	edition: string;
	version: string;
};

export default function LocalstackDevtoolsPanel() {
	const [selectedService, setSelectedService] = useState<string | null>(null);

	const { data, error, isLoading } = useQuery({
		queryKey: ["localstack-health"],
		queryFn: async () => {
			const res = await fetch("http://localhost:4566/_localstack/health");
			if (!res.ok) {
				throw new Error("Failed to fetch localstack health");
			}
			return (await res.json()) as LocalstackHealth;
		},

		retry: false,
		enabled: !selectedService,
	});

	if (selectedService === "ses") {
		return <SesPanel onBack={() => setSelectedService(null)} />;
	}

	if (selectedService === "s3") {
		return <S3Panel onBack={() => setSelectedService(null)} />;
	}

	if (isLoading) {
		return <div className="p-4">Loading LocalStack status...</div>;
	}

	if (error) {
		return (
			<div className="p-4 text-red-500">
				Failed to connect to LocalStack. Is it running?
			</div>
		);
	}

	if (!data) {
		return <div className="p-4">No data available</div>;
	}

	const services = Object.entries(data.services)
		.filter(([_, status]) => status === "running")
		.sort((a, b) => a[0].localeCompare(b[0]));

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="border-b p-4">
				<h2 className="font-semibold">LocalStack Status</h2>
				<div className="text-muted-foreground text-xs">
					Version: {data.version} ({data.edition})
				</div>
			</div>
			<div className="flex-1 overflow-auto p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Service</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{services.length === 0 ? (
							<TableRow>
								<TableCell colSpan={2} className="text-center">
									No running services found
								</TableCell>
							</TableRow>
						) : (
							services.map(([service, status]) => (
								<TableRow
									key={service}
									className={
										["ses", "s3"].includes(service)
											? "cursor-pointer hover:bg-muted"
											: ""
									}
									onClick={() => {
										if (service === "ses") {
											setSelectedService("ses");
										}
										if (service === "s3") {
											setSelectedService("s3");
										}
									}}
								>
									<TableCell className="font-medium font-mono">
										{service}
									</TableCell>
									<TableCell>
										<Badge
											variant={status === "running" ? "default" : "secondary"}
											className={
												status === "running"
													? "bg-green-500 hover:bg-green-600"
													: ""
											}
										>
											{status}
										</Badge>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
