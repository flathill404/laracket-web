import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { TestFormWrapper } from "@/test/utils";
import { render } from "@/test/utils/render";
import { SubscribeButton } from "./SubscribeButton";

describe("SubscribeButton", () => {
	test("renders with label", () => {
		render(
			<TestFormWrapper>
				<SubscribeButton label="Submit" />
			</TestFormWrapper>,
		);

		expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
	});

	test("is disabled when submitting", async () => {
		const user = userEvent.setup();
		let resolveSubmit: () => void;
		const handleSubmit = vi.fn().mockImplementation(() => {
			return new Promise<void>((resolve) => {
				resolveSubmit = resolve;
			});
		});

		render(
			<TestFormWrapper onSubmit={handleSubmit}>
				<SubscribeButton label="Save" />
			</TestFormWrapper>,
		);

		const button = screen.getByRole("button", { name: "Save" });
		expect(button).not.toBeDisabled();

		await user.click(button);

		expect(handleSubmit).toHaveBeenCalled();
		expect(button).toBeDisabled();

		// Finish submission
		// @ts-expect-error
		resolveSubmit();

		await waitFor(() => {
			expect(button).not.toBeDisabled();
		});
	});
});
