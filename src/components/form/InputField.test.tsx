import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { TestFieldWrapper } from "@/test/utils";
import { render } from "@/test/utils/render";
import { InputField } from "./InputField";

describe("InputField", () => {
	test("renders with label and placeholder", () => {
		render(
			<TestFieldWrapper defaultValue="">
				<InputField label="Email Address" placeholder="Enter your email" />
			</TestFieldWrapper>,
		);

		expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
	});

	test("renders description when provided", () => {
		render(
			<TestFieldWrapper defaultValue="">
				<InputField
					label="Username"
					description="Must be at least 3 characters"
				/>
			</TestFieldWrapper>,
		);

		expect(
			screen.getByText("Must be at least 3 characters"),
		).toBeInTheDocument();
	});

	test("updates value on input", async () => {
		const user = userEvent.setup();
		render(
			<TestFieldWrapper defaultValue="">
				<InputField label="Name" />
			</TestFieldWrapper>,
		);

		const input = screen.getByLabelText("Name");
		await user.type(input, "John Doe");

		expect(input).toHaveValue("John Doe");
	});

	test("displays error message when validation fails and field is touched", async () => {
		const user = userEvent.setup();
		const errorMessage = "Required field";

		render(
			<TestFieldWrapper
				defaultValue=""
				validate={(val) => (val ? undefined : errorMessage)}
			>
				<InputField label="Subject" />
			</TestFieldWrapper>,
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
			<TestFieldWrapper defaultValue="">
				<InputField label="Password" type="password" />
			</TestFieldWrapper>,
		);

		const input = screen.getByLabelText("Password");
		expect(input).toHaveAttribute("type", "password");
	});
});
