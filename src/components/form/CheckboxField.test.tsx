import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { TestFieldWrapper } from "@/test/utils";
import { render } from "@/test/utils/render";
import { CheckboxField } from "./CheckboxField";

describe("CheckboxField", () => {
	test("renders with label", () => {
		render(
			<TestFieldWrapper defaultValue={false}>
				<CheckboxField label="Accept Terms" />
			</TestFieldWrapper>,
		);

		expect(screen.getByLabelText("Accept Terms")).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	test("toggles checked state on click", async () => {
		const user = userEvent.setup();
		render(
			<TestFieldWrapper defaultValue={false}>
				<CheckboxField label="Enable Notifications" />
			</TestFieldWrapper>,
		);

		const checkbox = screen.getByRole("checkbox", {
			name: "Enable Notifications",
		});

		expect(checkbox).not.toBeChecked();

		await user.click(checkbox);
		expect(checkbox).toBeChecked();

		await user.click(checkbox);
		expect(checkbox).not.toBeChecked();
	});

	test("displays error message when validation fails and field is touched", async () => {
		const user = userEvent.setup();
		const errorMessage = "You must agree";

		render(
			<TestFieldWrapper
				defaultValue={false}
				validate={(val) => (val ? undefined : errorMessage)}
			>
				<CheckboxField label="Agree" />
			</TestFieldWrapper>,
		);

		const checkbox = screen.getByRole("checkbox", { name: "Agree" });

		// Click to check (valid)
		await user.click(checkbox);
		expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

		// Click to uncheck (invalid + touched)
		await user.click(checkbox);

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});
});
