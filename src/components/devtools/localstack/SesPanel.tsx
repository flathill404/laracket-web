import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import PostalMime from "postal-mime";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export type SesMessage = {
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

export type SesRawMessage = {
	Id: string;
	Region: string;
	Source: string;
	RawData: string;
	Timestamp: string;
};

type SesResponse = {
	messages: SesRawMessage[];
};

const parseEmail = async (raw: string): Promise<Partial<SesMessage>> => {
	const parser = new PostalMime();
	const email = await parser.parse(raw);

	return {
		Source: email.from?.address ?? "",
		Subject: email.subject ?? "(No Subject)",
		Destination: {
			ToAddresses:
				email.to?.map((addr) => addr.address).filter((a): a is string => !!a) ??
				[],
			CcAddresses:
				email.cc?.map((addr) => addr.address).filter((a): a is string => !!a) ??
				[],
			BccAddresses:
				email.bcc
					?.map((addr) => addr.address)
					.filter((a): a is string => !!a) ?? [],
		},
		Body: {
			text_part: email.text ?? null,
			html_part: email.html ?? null,
		},
	};
};

import { SesEmailDetail } from "./SesEmailDetail";

export function SesPanel({ onBack }: { onBack: () => void }) {
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
			const parsedMessages = await Promise.all(
				rawData.messages.map(async (msg) => ({
					...msg,
					...(await parseEmail(msg.RawData)),
				})),
			);
			return {
				messages: parsedMessages as SesMessage[],
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
