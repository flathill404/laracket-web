import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type LocalstackHealth = {
	services: Record<string, "running" | "disabled" | "available">;
	edition: string;
	version: string;
};

type SesMessage = {
	Id: string;
	Region: string;
	Source: string;
	Destination: {
		ToAddresses: string[];
		CcAddresses: string[];
		BccAddresses: string[];
	};
	Subject: string;
	Body: {
		text_part: string | null;
		html_part: string | null;
	};
	Timestamp: string;
};

type SesResponse = {
	messages: SesMessage[];
};

function SesEmailDetail({
	message,
	onBack,
}: {
	message: SesMessage;
	onBack: () => void;
}) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex items-center gap-2 border-b p-4">
				<Button variant="ghost" size="icon" onClick={onBack}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="font-semibold">{message.Subject}</h2>
					<div className="text-muted-foreground text-xs">
						{new Date(message.Timestamp).toLocaleString()}
					</div>
				</div>
			</div>
			<div className="flex-1 space-y-4 overflow-auto p-4">
				<div className="grid gap-2">
					<div className="grid grid-cols-[100px_1fr] gap-2">
						<span className="font-semibold text-sm">From:</span>
						<span className="text-sm">{message.Source}</span>
					</div>
					<div className="grid grid-cols-[100px_1fr] gap-2">
						<span className="font-semibold text-sm">To:</span>
						<span className="text-sm">
							{message.Destination?.ToAddresses?.join(", ")}
						</span>
					</div>
					{message.Destination?.CcAddresses?.length > 0 && (
						<div className="grid grid-cols-[100px_1fr] gap-2">
							<span className="font-semibold text-sm">Cc:</span>
							<span className="text-sm">
								{message.Destination?.CcAddresses?.join(", ")}
							</span>
						</div>
					)}
					{message.Destination?.BccAddresses?.length > 0 && (
						<div className="grid grid-cols-[100px_1fr] gap-2">
							<span className="font-semibold text-sm">Bcc:</span>
							<span className="text-sm">
								{message.Destination?.BccAddresses?.join(", ")}
							</span>
						</div>
					)}
				</div>
				<div className="border-t pt-4">
					{message.Body.html_part ? (
						<iframe
							srcDoc={message.Body.html_part}
							className="h-[400px] w-full border-none"
							title="Email Content"
						/>
					) : (
						<pre className="whitespace-pre-wrap font-mono text-sm">
							{message.Body.text_part}
						</pre>
					)}
				</div>
			</div>
		</div>
	);
}

function SesPanel({ onBack }: { onBack: () => void }) {
	const [selectedMessage, setSelectedMessage] = useState<SesMessage | null>(
		null,
	);

	const { data, isLoading, error } = useQuery({
		queryKey: ["localstack-ses"],
		queryFn: async () => {
			const res = await fetch("http://localhost:4566/_aws/ses");
			if (!res.ok) {
				throw new Error("Failed to fetch SES messages");
			}
			return (await res.json()) as SesResponse;
		},
		refetchInterval: 2000,
		enabled: !selectedMessage,
	});

	if (selectedMessage) {
		return (
			<SesEmailDetail
				message={selectedMessage}
				onBack={() => setSelectedMessage(null)}
			/>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex items-center gap-2 border-b p-4">
				<Button variant="ghost" size="icon" onClick={onBack}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="font-semibold">SES Emails</h2>
					<div className="text-muted-foreground text-xs">
						{data?.messages.length ?? 0} messages
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-auto p-4">
				{isLoading ? (
					<div>Loading emails...</div>
				) : error ? (
					<div className="text-red-500">Failed to load emails</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Timestamp</TableHead>
								<TableHead>Source</TableHead>
								<TableHead>Destination</TableHead>
								<TableHead>Subject</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.messages.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} className="text-center">
										No emails found
									</TableCell>
								</TableRow>
							) : (
								data?.messages.map((msg) => (
									<TableRow
										key={msg.Id}
										className="cursor-pointer hover:bg-muted"
										onClick={() => setSelectedMessage(msg)}
									>
										<TableCell className="whitespace-nowrap">
											{new Date(msg.Timestamp).toLocaleString()}
										</TableCell>
										<TableCell>{msg.Source}</TableCell>
										<TableCell>
											{msg.Destination?.ToAddresses?.join(", ")}
										</TableCell>
										<TableCell>{msg.Subject}</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}

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
		refetchInterval: 5000,
		retry: false,
		enabled: !selectedService,
	});

	if (selectedService === "ses") {
		return <SesPanel onBack={() => setSelectedService(null)} />;
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
										service === "ses" ? "cursor-pointer hover:bg-muted" : ""
									}
									onClick={() => {
										if (service === "ses") {
											setSelectedService("ses");
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
