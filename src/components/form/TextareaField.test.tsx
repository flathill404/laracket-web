import { useForm } from "@tanstack/react-form";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, test } from "vitest";
import { render } from "@/test/utils/render";
import { fieldContext } from "./formContext";
import { TextareaField } from "./TextareaField";

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

describe("TextareaField", () => {
	test("renders with label and placeholder", () => {
		render(
			<TestForm>
				<TextareaField label="Bio" placeholder="Tell us about yourself" />
			</TestForm>,
		);

		expect(screen.getByLabelText("Bio")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Tell us about yourself"),
		).toBeInTheDocument();
	});

	test("renders description when provided", () => {
		render(
			<TestForm>
				<TextareaField
					label="Comments"
					description="Please keep it respectful"
				/>
			</TestForm>,
		);

		expect(screen.getByText("Please keep it respectful")).toBeInTheDocument();
	});

	test("updates value on input", async () => {
		const user = userEvent.setup();
		render(
			<TestForm>
				<TextareaField label="Feedback" />
			</TestForm>,
		);

		const textarea = screen.getByLabelText("Feedback");
		await user.type(textarea, "Great service!");

		expect(textarea).toHaveValue("Great service!");
	});

	test("displays error message when validation fails and field is touched", async () => {
		const user = userEvent.setup();
		const errorMessage = "Required field";

		render(
			<TestForm validate={(val) => (val ? undefined : errorMessage)}>
				<TextareaField label="Description" />
			</TestForm>,
		);

		const textarea = screen.getByLabelText("Description");

		// Type to trigger validation, then clear to make it invalid
		await user.type(textarea, "a");
		await user.clear(textarea);
		await user.tab();

		expect(screen.getByText(errorMessage)).toBeInTheDocument();
	});

	test("applies custom className", () => {
		render(
			<TestForm>
				<TextareaField label="Custom" className="h-32" />
			</TestForm>,
		);

		const textarea = screen.getByLabelText("Custom");
		expect(textarea).toHaveClass("h-32");
	});
});
