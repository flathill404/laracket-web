import { Suspense } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@/components/ui/sheet";
import { CreateTicketDrawerSkeleton } from "./CreateTicketDrawerSkeleton";
import { CreateTicketForm } from "./CreateTicketForm";

interface CreateTicketDrawerProps {
	projectId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateTicketDrawer({
	projectId,
	open,
	onOpenChange,
}: CreateTicketDrawerProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[90%] gap-0 overflow-hidden p-0 sm:max-w-5xl"
			>
				<SheetTitle className="sr-only">Create Ticket</SheetTitle>
				<SheetDescription className="sr-only">
					Form to create a new ticket
				</SheetDescription>
				<Suspense fallback={<CreateTicketDrawerSkeleton />}>
					<CreateTicketForm projectId={projectId} onOpenChange={onOpenChange} />
				</Suspense>
			</SheetContent>
		</Sheet>
	);
}
