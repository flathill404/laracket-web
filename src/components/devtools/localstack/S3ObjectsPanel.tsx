import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const parseXml = (xml: string) => {
	const parser = new DOMParser();
	return parser.parseFromString(xml, "text/xml");
};

type S3Object = {
	Key: string;
	LastModified: string;
	Size: string;
};

export function S3ObjectsPanel({
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
