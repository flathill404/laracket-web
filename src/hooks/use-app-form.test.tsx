import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render } from "@/test/utils";
import { useAppForm } from "./use-app-form";

function TestForm({ onSubmit }: { onSubmit: (values: unknown) => void }) {
	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			agree: false,
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.AppField
				name="name"
				children={(field) => (
					<field.InputField label="Name" placeholder="Enter name" />
				)}
			/>
			<form.AppField
				name="description"
				children={(field) => (
					<field.TextareaField label="Description" placeholder="Enter desc" />
				)}
			/>
			<form.AppField
				name="agree"
				children={(field) => <field.CheckboxField label="Agree to terms" />}
			/>
			<form.AppForm>
				<form.SubscribeButton label="Submit" />
			</form.AppForm>
		</form>
	);
}

describe("useAppForm", () => {
	it("renders form fields correctly", () => {
		render(<TestForm onSubmit={() => {}} />);

		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
		expect(screen.getByLabelText("Description")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Enter desc")).toBeInTheDocument();
		expect(screen.getByLabelText("Agree to terms")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
	});

	it("handles input changes and submission", async () => {
		const handleSubmit = vi.fn();
		const user = userEvent.setup();

		render(<TestForm onSubmit={handleSubmit} />);

		await user.type(screen.getByLabelText("Name"), "John Doe");
		await user.type(screen.getByLabelText("Description"), "A test user");
		await user.click(screen.getByLabelText("Agree to terms"));

		await user.click(screen.getByRole("button", { name: "Submit" }));

		await waitFor(() => {
			expect(handleSubmit).toHaveBeenCalledWith({
				name: "John Doe",
				description: "A test user",
				agree: true,
			});
		});
	});

	it("applies error styling when validation fails", async () => {
		const user = userEvent.setup();

		function ValidatedForm() {
			const form = useAppForm({
				defaultValues: {
					name: "",
				},
				onSubmit: () => {},
			});

			return (
				<form>
					<form.AppField
						name="name"
						validators={{
							onBlur: ({ value }) => (!value ? "Name is required" : undefined),
						}}
						children={(field) => <field.InputField label="Name" />}
					/>
					<form.AppForm>
						<form.SubscribeButton label="Submit" />
					</form.AppForm>
				</form>
			);
		}

		render(<ValidatedForm />);

		const nameInput = screen.getByLabelText("Name");

		// Before blur, no error styling
		expect(nameInput).not.toHaveClass("border-red-500");

		// Focus and blur to trigger validation
		await user.click(nameInput);
		await user.tab();

		// After blur with empty value, error styling should be applied
		await waitFor(() => {
			expect(nameInput).toHaveClass("border-red-500");
		});
	});
});
