import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { CreateTicketDrawer } from "./CreateTicketDrawer";

// Mock the CreateTicketForm component
vi.mock("./CreateTicketForm", () => ({
	CreateTicketForm: ({
		projectId,
		onOpenChange,
	}: {
		projectId: string;
		onOpenChange: (open: boolean) => void;
	}) => (
		<div data-testid="create-ticket-form">
			<span>Project: {projectId}</span>
			<button type="button" onClick={() => onOpenChange(false)}>
				Close
			</button>
		</div>
	),
}));

describe("CreateTicketDrawer", () => {
	it("renders the drawer title when open", () => {
		render(
			<CreateTicketDrawer projectId="p1" open={true} onOpenChange={vi.fn()} />,
		);

		expect(screen.getByTestId("create-ticket-form")).toBeInTheDocument();
	});

	it("does not render when closed", () => {
		render(
			<CreateTicketDrawer projectId="p1" open={false} onOpenChange={vi.fn()} />,
		);

		// Sheet content should not be visible when closed
		expect(screen.queryByTestId("create-ticket-form")).not.toBeInTheDocument();
	});

	it("passes the projectId to the form", () => {
		render(
			<CreateTicketDrawer
				projectId="test-project"
				open={true}
				onOpenChange={vi.fn()}
			/>,
		);

		expect(screen.getByText("Project: test-project")).toBeInTheDocument();
	});
});
