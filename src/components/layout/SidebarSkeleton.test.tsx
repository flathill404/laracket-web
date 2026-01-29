import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { SidebarSkeleton } from "./SidebarSkeleton";

describe("SidebarSkeleton", () => {
	it("renders the skeleton structure", () => {
		const { container } = render(<SidebarSkeleton />);
		// It should render an aside element
		expect(container.querySelector("aside")).toBeInTheDocument();
		// It should contain several skeleton elements
		// Assuming skeleton renders a div with a specific class or we can just check structure
		// shadcn skeleton is a div.
		expect(container.querySelectorAll(".animate-pulse")).not.toHaveLength(0);
	});
});
