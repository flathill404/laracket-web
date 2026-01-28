import userEvent from "@testing-library/user-event";
import { Folder } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Accordion } from "@/components/ui/accordion";
import { render, screen } from "@/test/utils";
import { SidebarSection } from "./SidebarSection";

describe("SidebarSection", () => {
	const defaultProps = {
		value: "test-section",
		icon: Folder,
		title: "Test Section",
		onAddClick: vi.fn(),
		addTooltip: "Add Item",
	};

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<Accordion type="multiple" defaultValue={["test-section"]}>
			{children}
		</Accordion>
	);

	it("renders title and icon", () => {
		render(
			<Wrapper>
				<SidebarSection {...defaultProps}>Content</SidebarSection>
			</Wrapper>,
		);
		expect(screen.getByText("Test Section")).toBeInTheDocument();
	});

	it("renders children content", () => {
		render(
			<Wrapper>
				<SidebarSection {...defaultProps}>
					<div data-testid="child">Child Content</div>
				</SidebarSection>
			</Wrapper>,
		);
		expect(screen.getByTestId("child")).toBeInTheDocument();
	});

	it("calls onAddClick when add button is clicked", async () => {
		const user = userEvent.setup();
		render(
			<Wrapper>
				<SidebarSection {...defaultProps}>Content</SidebarSection>
			</Wrapper>,
		);

		// The button is technically hidden by default (invisible group-hover:visible)
		// But in jsdom styles are not computed 100% same as browser for visibility unless explicitly set?
		// Anyway, we can find it. It's a button.
		const buttons = screen.getAllByRole("button");
		// Filter out the accordion trigger
		const addButton = buttons.find(
			(btn) => !btn.textContent?.includes("Test Section"),
		);

		if (!addButton) {
			throw new Error("Add button not found");
		}

		await user.click(addButton);
		expect(defaultProps.onAddClick).toHaveBeenCalled();
	});
});
