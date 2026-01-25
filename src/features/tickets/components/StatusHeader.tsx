import { Check, Circle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib";
import { ALL_STATUSES, STATUS_LABELS } from "../utils/constants";
import { getStatusColor } from "../utils/status";

const statuses = ALL_STATUSES.map((status) => ({
	value: status,
	label: STATUS_LABELS[status],
}));

export function StatusHeader({
	selectedStatuses,
	onStatusChange,
}: {
	selectedStatuses: string[];
	onStatusChange?: (statuses: string[]) => void;
}) {
	return (
		<div className="flex items-center space-x-2">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							"-ml-3 h-8 hover:bg-accent/50 data-[state=open]:bg-accent",
							selectedStatuses.length > 0 &&
								"bg-accent/50 font-medium text-accent-foreground",
						)}
					>
						<span>Status</span>
						{selectedStatuses.length > 0 && (
							<Badge
								variant="secondary"
								className="ml-2 rounded-sm px-1 font-normal"
							>
								{selectedStatuses.length}
							</Badge>
						)}
						<Filter
							className={cn(
								"ml-2 h-4 w-4",
								selectedStatuses.length > 0
									? "fill-primary/20 text-primary"
									: "text-muted-foreground",
							)}
						/>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<Command>
						<CommandList>
							<CommandGroup>
								{statuses.map((status) => {
									const isSelected = selectedStatuses.includes(status.value);
									return (
										<CommandItem
											key={status.value}
											onSelect={() => {
												if (onStatusChange) {
													const newStatuses = isSelected
														? selectedStatuses.filter((s) => s !== status.value)
														: [...selectedStatuses, status.value];
													onStatusChange(newStatuses);
												}
											}}
										>
											<div
												className={cn(
													"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
													isSelected
														? "bg-primary text-primary-foreground"
														: "opacity-50 [&_svg]:invisible",
												)}
											>
												<Check className={cn("h-4 w-4")} />
											</div>
											<span className="flex items-center gap-2">
												<Circle
													className={`h-3 w-3 ${getStatusColor(status.value)}`}
												/>
												{status.label}
											</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							{selectedStatuses.length > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											onSelect={() => onStatusChange?.([])}
											className="justify-center text-center"
										>
											Clear filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
