import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts();

function InputField({
	label,
	placeholder,
	type = "text",
}: {
	label: string;
	placeholder?: string;
	type?: string;
}) {
	const field = useFieldContext();

	const hasError = !field.state.meta.isValid;

	return (
		<Field>
			<FieldLabel
				htmlFor={field.name}
				className={hasError ? "text-red-500" : ""}
			>
				{label}
			</FieldLabel>

			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				type={type}
				className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
			/>

			{hasError && (
				<FieldError>{field.state.meta.errors.join(", ")}</FieldError>
			)}
		</Field>
	);
}

function SubscribeButton({ label }: { label: string }) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => <Button disabled={isSubmitting}>{label}</Button>}
		</form.Subscribe>
	);
}

const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		InputField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

export { useAppForm, withForm };
