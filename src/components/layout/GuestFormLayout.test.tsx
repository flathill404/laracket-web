import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
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
