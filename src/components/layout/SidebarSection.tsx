import { ChevronRight, Plus } from "lucide-react";
import type { ElementType, ReactNode } from "react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarSectionProps {
	value: string;
	icon: ElementType;
	title: string;
	onAddClick: () => void;
	addTooltip: string;
	children: ReactNode;
}

export function SidebarSection({
	value,
	icon: Icon,
	title,
	onAddClick,
	addTooltip,
	children,
}: SidebarSectionProps) {
	return (
		<AccordionItem value={value} className="border-b-0">
			<div className="group flex items-center justify-between pr-2">
				<AccordionTrigger className="w-full py-2 text-muted-foreground hover:text-primary hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]_.custom-chevron]:rotate-90">
					<div className="flex items-center gap-3 px-3">
						<ChevronRight className="custom-chevron h-4 w-4 shrink-0 transition-transform duration-200" />
						<Icon className="h-4 w-4" />
						{title}
					</div>
				</AccordionTrigger>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									onAddClick();
								}}
								className="invisible rounded-sm p-1 hover:bg-muted group-hover:visible"
							>
								<Plus className="h-4 w-4 text-muted-foreground" />
							</button>
						</TooltipTrigger>
						<TooltipContent>{addTooltip}</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<AccordionContent className="pb-0">
				<div className="flex flex-col gap-1 pl-9">{children}</div>
			</AccordionContent>
		</AccordionItem>
	);
}
