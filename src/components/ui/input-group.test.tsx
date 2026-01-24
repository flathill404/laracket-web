// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";

describe("InputGroup", () => {
	it("renders addon and input", () => {
		render(
			<InputGroup>
				<InputGroupAddon>@</InputGroupAddon>
				<InputGroupInput placeholder="Username" />
			</InputGroup>,
		);

		expect(screen.getByText("@")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
	});

	it("focuses input when addon is clicked", () => {
		render(
			<InputGroup>
				<InputGroupAddon data-testid="addon">@</InputGroupAddon>
				<InputGroupInput placeholder="Username" />
			</InputGroup>,
		);

		const input = screen.getByPlaceholderText("Username");
		const addon = screen.getByTestId("addon");

		fireEvent.click(addon);
		expect(input).toHaveFocus();
	});
});
