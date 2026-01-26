import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { TestFieldWrapper } from "@/test/utils";
import { render } from "@/test/utils/render";
import { TextareaField } from "./TextareaField";

describe("TextareaField", () => {
	test("renders with label and placeholder", () => {
		render(
			<TestFieldWrapper defaultValue="">
				<TextareaField label="Bio" placeholder="Tell us about yourself" />
			</TestFieldWrapper>,
		);

		expect(screen.getByLabelText("Bio")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("Tell us about yourself"),
		).toBeInTheDocument();
	});

	test("renders description when provided", () => {
		render(
			<TestFieldWrapper defaultValue="">
				<TextareaField
					label="Comments"
					description="Please keep it respectful"
				/>
			</TestFieldWrapper>,
		);

		expect(screen.getByText("Please keep it respectful")).toBeInTheDocument();
	});

	test("updates value on input", async () => {
		const user = userEvent.setup();
		render(
			<TestFieldWrapper defaultValue="">
				<TextareaField label="Feedback" />
			</TestFieldWrapper>,
		);

		const textarea = screen.getByLabelText("Feedback");
		await user.type(textarea, "Great service!");

		expect(textarea).toHaveValue("Great service!");
	});

	test("displays error message when validation fails and field is touched", async () => {
		const user = userEvent.setup();
		const errorMessage = "Required field";

		render(
			<TestFieldWrapper
				defaultValue=""
				validate={(val) => (val ? undefined : errorMessage)}
			>
				<TextareaField label="Description" />
			</TestFieldWrapper>,
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
			<TestFieldWrapper defaultValue="">
				<TextareaField label="Custom" className="h-32" />
			</TestFieldWrapper>,
		);

		const textarea = screen.getByLabelText("Custom");
		expect(textarea).toHaveClass("h-32");
	});
});
