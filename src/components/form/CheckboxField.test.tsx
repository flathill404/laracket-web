import { useForm } from "@tanstack/react-form";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { render } from "@/test/utils/render";
import { CheckboxField } from "./CheckboxField";
import { fieldContext } from "./formContext";

function TestForm({
	children,
	defaultChecked = false,
	validate,
}: {
	children: ReactNode;
	defaultChecked?: boolean;
	validate?: (value: boolean) => string | undefined;
}) {
	const form = useForm({
		defaultValues: {
			testField: defaultChecked,
		},
	});

	return (
		<form.Field
			name="testField"
			validators={{
				onChange: validate
					? ({ value }) => {
							const error = validate(value as boolean);
							return error ? { message: error } : undefined;
						}
					: undefined,
			}}
		>
			{(field) => (
				<fieldContext.Provider value={field}>{children}</fieldContext.Provider>
			)}
		</form.Field>
	);
}

describe("CheckboxField", () => {
	test("renders with label", () => {
		render(
			<TestForm>
				<CheckboxField label="Accept Terms" />
			</TestForm>,
		);

		expect(screen.getByLabelText("Accept Terms")).toBeInTheDocument();
		expect(screen.getByRole("checkbox")).not.toBeChecked();
	});

	test("toggles checked state on click", async () => {
		const user = userEvent.setup();
		render(
			<TestForm>
				<CheckboxField label="Enable Notifications" />
			</TestForm>,
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
			<TestForm validate={(val) => (val ? undefined : errorMessage)}>
				<CheckboxField label="Agree" />
			</TestForm>,
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
