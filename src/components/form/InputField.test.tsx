import { useForm } from "@tanstack/react-form";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { render } from "@/test/utils/render";
import { fieldContext } from "./formContext";
import { InputField } from "./InputField";

function TestForm({
	children,
	defaultValue = "",
	validate,
}: {
	children: ReactNode;
	defaultValue?: string;
	validate?: (value: string) => string | undefined;
}) {
	const form = useForm({
		defaultValues: {
			testField: defaultValue,
		},
	});

	return (
		<form.Field
			name="testField"
			validators={{
				onChange: validate
					? ({ value }) => {
							const error = validate(value as string);
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

describe("InputField", () => {
	test("renders with label and placeholder", () => {
		render(
			<TestForm>
				<InputField label="Email Address" placeholder="Enter your email" />
			</TestForm>,
		);

		expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
	});

	test("renders description when provided", () => {
		render(
			<TestForm>
				<InputField
					label="Username"
					description="Must be at least 3 characters"
				/>
			</TestForm>,
		);

		expect(
			screen.getByText("Must be at least 3 characters"),
		).toBeInTheDocument();
	});

	test("updates value on input", async () => {
		const user = userEvent.setup();
		render(
			<TestForm>
				<InputField label="Name" />
			</TestForm>,
		);

		const input = screen.getByLabelText("Name");
		await user.type(input, "John Doe");

		expect(input).toHaveValue("John Doe");
	});

	test("displays error message when validation fails and field is touched", async () => {
		const user = userEvent.setup();
		const errorMessage = "Required field";

		render(
			<TestForm validate={(val) => (val ? undefined : errorMessage)}>
				<InputField label="Subject" />
			</TestForm>,
		);

		const input = screen.getByLabelText("Subject");

		// Type to trigger validation, then clear to make it invalid
		await user.type(input, "a");
		await user.clear(input);
		await user.tab();

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	test("respects type prop", () => {
		render(
			<TestForm>
				<InputField label="Password" type="password" />
			</TestForm>,
		);

		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "password");
	});
});
