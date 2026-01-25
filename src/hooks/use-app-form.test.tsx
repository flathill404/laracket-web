import { render, screen, waitFor } from "@/test/utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useAppForm } from "./use-app-form";

// Mocks for ui components if needed, but since we are testing integration with useAppForm,
// we might want to render them. However, if they are complex, shallow render might be better.
// But useAppForm uses concrete implementations of InputField, CheckboxField etc.
// which import from @/components/ui/*.
// Assuming shadcn components work in test env (they should).

function TestForm({ onSubmit }: { onSubmit: (values: any) => void }) {
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
			<form.Field
				name="name"
				children={(field: any) => (
					<field.InputField label="Name" placeholder="Enter name" />
				)}
			/>
			<form.Field
				name="description"
				children={(field: any) => (
					<field.TextareaField label="Description" placeholder="Enter desc" />
				)}
			/>
			<form.Field
				name="agree"
				children={(field: any) => (
					<field.CheckboxField label="Agree to terms" />
				)}
			/>
			<form.SubscribeButton label="Submit" />
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

	it("displays validation errors", async () => {
		// To test validation, we need to pass validators to useAppForm
		// But useAppForm in the test helper above didn't have validators.
		// Let's create a form with validators.

		const handleSubmit = vi.fn();
		const user = userEvent.setup();

		function ValidatedForm() {
			const form = useAppForm({
				defaultValues: {
					name: "",
				},
				validators: {
					onChange: ({ value }) => ({
						name: !value.name ? { message: "Name is required" } : undefined,
					}),
				},
				onSubmit: ({ value }) => handleSubmit(value),
			});

			return (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<form.Field
						name="name"
						children={(field: any) => <field.InputField label="Name" />}
					/>
					<form.SubscribeButton label="Submit" />
				</form>
			);
		}

		render(<ValidatedForm />);

		const submitBtn = screen.getByRole("button", { name: "Submit" });
		await user.click(submitBtn);

		// TanStack form validation is async or immediate depending on config.
		// Standard validation usually happens on change or submit.
		// The error message should appear.

		// Note: The provided use-app-form.tsx InputField implementation
		// conditionally renders <FieldError /> based on field.state.meta.errors

		await waitFor(() => {
			expect(screen.getByText("Name is required")).toBeInTheDocument();
		});
	});
});
