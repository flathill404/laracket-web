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
	Body?: {
		text_part: string | null;
		html_part: string | null;
	};
	Timestamp: string;
};

type SesRawMessage = {
	Id: string;
	Region: string;
	Source: string;
	RawData: string;
	Timestamp: string;
};

type SesResponse = {
	messages: SesRawMessage[];
};

const parseEmail = (raw: string): Partial<SesMessage> => {
	const [headersRaw, ...bodyParts] = raw.split("\r\n\r\n");
	const bodyRaw = bodyParts.join("\r\n\r\n");
	const headers: Record<string, string> = {};

	headersRaw.split("\r\n").forEach((line) => {
		const [key, ...value] = line.split(": ");
		if (key && value) {
			headers[key.toLowerCase()] = value.join(": ");
		}
	});

	const subject = headers["subject"] ?? "(No Subject)";
	const source = headers["from"] ?? "";
	const to = headers["to"]?.split(",").map((s) => s.trim()) ?? [];

	let textPart: string | null = null;
	let htmlPart: string | null = null;

	const contentType = headers["content-type"] ?? "";
	const boundaryMatch = contentType.match(/boundary=([^;]+)/);

	if (boundaryMatch && boundaryMatch[1]) {
		const boundary = boundaryMatch[1];
		const parts = bodyRaw.split(`--${boundary}`);

		for (const part of parts) {
			if (part.includes("Content-Type: text/plain")) {
				textPart = part.split("\r\n\r\n")[1]?.trim() ?? null;
				// Remove quoted printable soft breaks
				if (part.includes("Content-Transfer-Encoding: quoted-printable")) {
					textPart = textPart?.replace(/=\r\n/g, "") ?? textPart;
				}
			}
			if (part.includes("Content-Type: text/html")) {
				htmlPart = part.split("\r\n\r\n")[1]?.trim() ?? null;
				// Remove quoted printable soft breaks
				if (part.includes("Content-Transfer-Encoding: quoted-printable")) {
					htmlPart = htmlPart?.replace(/=\r\n/g, "") ?? htmlPart;
				}
			}
		}
	} else {
		textPart = bodyRaw;
	}

	return {
		Source: source,
		Subject: subject,
		Destination: {
			ToAddresses: to,
			CcAddresses: [],
			BccAddresses: [],
		},
		Body: {
			text_part: textPart,
			html_part: htmlPart,
		},
	};
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
					{message.Body?.html_part ? (
						<iframe
							srcDoc={message.Body.html_part}
							className="h-[400px] w-full border-none"
							title="Email Content"
						/>
					) : (
						<pre className="whitespace-pre-wrap font-mono text-sm">
							{message.Body?.text_part ?? "No content"}
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
			const rawData = (await res.json()) as SesResponse;
			return {
				messages: rawData.messages.map((msg) => ({
					...msg,
					...parseEmail(msg.RawData),
				})) as SesMessage[],
			};
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

const parseXml = (xml: string) => {
	const parser = new DOMParser();
	return parser.parseFromString(xml, "text/xml");
};

type S3Bucket = {
	Name: string;
	CreationDate: string;
};

type S3Object = {
	Key: string;
	LastModified: string;
	Size: string;
};

function S3ObjectsPanel({
	bucket,
	onBack,
}: {
	bucket: string;
	onBack: () => void;
}) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["localstack-s3-objects", bucket],
		queryFn: async () => {
			const res = await fetch(`http://localhost:4566/${bucket}`);
			if (!res.ok) throw new Error("Failed to fetch objects");
			const text = await res.text();
			const doc = parseXml(text);
			const contents = Array.from(doc.querySelectorAll("Contents"));
			return contents.map((item) => ({
				Key: item.querySelector("Key")?.textContent ?? "",
				LastModified: item.querySelector("LastModified")?.textContent ?? "",
				Size: item.querySelector("Size")?.textContent ?? "",
			})) as S3Object[];
		},
	});

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex items-center gap-2 border-b p-4">
				<Button variant="ghost" size="icon" onClick={onBack}>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div>
					<h2 className="font-semibold">Bucket: {bucket}</h2>
					<div className="text-muted-foreground text-xs">
						{data?.length ?? 0} objects
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-auto p-4">
				{isLoading ? (
					<div>Loading objects...</div>
				) : error ? (
					<div className="text-red-500">Failed to load objects</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Key</TableHead>
								<TableHead>Size (B)</TableHead>
								<TableHead>Last Modified</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={3} className="text-center">
										No objects found
									</TableCell>
								</TableRow>
							) : (
								data?.map((obj) => (
									<TableRow
										key={obj.Key}
										className="cursor-pointer hover:bg-muted"
										onClick={() =>
											window.open(
												`http://localhost:4566/${bucket}/${obj.Key}`,
												"_blank",
											)
										}
									>
										<TableCell className="font-mono">{obj.Key}</TableCell>
										<TableCell>{obj.Size}</TableCell>
										<TableCell>
											{new Date(obj.LastModified).toLocaleString()}
										</TableCell>
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

function S3Panel({ onBack }: { onBack: () => void }) {
	const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

	const { data, isLoading, error } = useQuery({
		queryKey: ["localstack-s3-buckets"],
		queryFn: async () => {
			const res = await fetch("http://s3.localhost.localstack.cloud:4566/");
			if (!res.ok) throw new Error("Failed to fetch buckets");
			const text = await res.text();
			const doc = parseXml(text);
			const buckets = Array.from(doc.querySelectorAll("Bucket"));
			return buckets.map((bucket) => ({
				Name: bucket.querySelector("Name")?.textContent ?? "",
				CreationDate: bucket.querySelector("CreationDate")?.textContent ?? "",
			})) as S3Bucket[];
		},
		enabled: !selectedBucket,
	});

	if (selectedBucket) {
		return (
			<S3ObjectsPanel
				bucket={selectedBucket}
				onBack={() => setSelectedBucket(null)}
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
					<h2 className="font-semibold">S3 Buckets</h2>
					<div className="text-muted-foreground text-xs">
						{data?.length ?? 0} buckets
					</div>
				</div>
			</div>
			<div className="flex-1 overflow-auto p-4">
				{isLoading ? (
					<div>Loading buckets...</div>
				) : error ? (
					<div className="text-red-500">Failed to load buckets</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Creation Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={2} className="text-center">
										No buckets found
									</TableCell>
								</TableRow>
							) : (
								data?.map((bucket) => (
									<TableRow
										key={bucket.Name}
										className="cursor-pointer hover:bg-muted"
										onClick={() => setSelectedBucket(bucket.Name)}
									>
										<TableCell className="font-medium font-mono">
											{bucket.Name}
										</TableCell>
										<TableCell>
											{new Date(bucket.CreationDate).toLocaleString()}
										</TableCell>
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
