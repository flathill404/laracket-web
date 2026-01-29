import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import { GuestFormLayout } from "./GuestFormLayout";

describe("GuestFormLayout", () => {
	it("renders children correctly", () => {
		render(
			<GuestFormLayout>
				<div data-testid="test-child">Child Content</div>
			</GuestFormLayout>,
		);

		expect(screen.getByTestId("test-child")).toBeInTheDocument();
		expect(screen.getByText("Child Content")).toBeInTheDocument();
	});
});
