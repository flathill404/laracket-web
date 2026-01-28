import type { LinkProps } from "@tanstack/react-router";
import { Folder } from "lucide-react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { SidebarLink } from "./SidebarLink";

// Mock Link
vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		className,
		...props
	}: {
		children: ReactNode;
		className?: string;
		[key: string]: unknown;
	}) => (
		<a className={className} data-testid="link" {...props}>
			{children}
		</a>
	),
}));

describe("SidebarLink", () => {
	const defaultProps = {
		to: "/test",
	} as unknown as Omit<LinkProps, "children">;

	it("renders link content", () => {
		render(<SidebarLink {...defaultProps}>Test Link</SidebarLink>);
		expect(screen.getByText("Test Link")).toBeInTheDocument();
	});

	it("renders with icon", () => {
		render(
			<SidebarLink {...defaultProps} icon={Folder}>
				Test Link
			</SidebarLink>,
		);
		expect(screen.getByText("Test Link")).toBeInTheDocument();
		// We can't easily test the icon is rendered specifically without test id on icon,
		// but we can check if the children are rendered alongside it.
	});

	it("passes extra props to Link", () => {
		render(<SidebarLink {...defaultProps} data-custom="test" />);
		expect(screen.getByTestId("link")).toHaveAttribute("data-custom", "test");
	});
});
