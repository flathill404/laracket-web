import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts();

function InputField({
	label,
	placeholder,
	description,
	type = "text",
}: {
	label: string;
	placeholder?: string;
	description?: string;
	type?: string;
}) {
	const field = useFieldContext();

	const hasError = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field>
			<FieldLabel
				htmlFor={field.name}
				className={hasError ? "text-red-600" : ""}
			>
				{label}
			</FieldLabel>

			<Input
				id={field.name}
				name={field.name}
				value={field.state.value as string}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				type={type}
				className={hasError ? "border-red-500 focus-visible:ring-red-500" : ""}
			/>

			{description && <FieldDescription>{description}</FieldDescription>}

			{hasError && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}

function CheckboxField({ label }: { label: string }) {
	const field = useFieldContext();

	const hasError = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<Field
			className="flex flex-row items-center gap-2 space-y-0"
			orientation="horizontal"
		>
			<Checkbox
				id={field.name}
				checked={field.state.value as boolean}
				onCheckedChange={(checked) => field.handleChange(checked)}
				className={hasError ? "border-red-500" : ""}
			/>
			<FieldLabel
				htmlFor={field.name}
				className={hasError ? "text-red-600" : ""}
			>
				{label}
			</FieldLabel>

			{hasError && <FieldError errors={field.state.meta.errors} />}
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
		CheckboxField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

export { useAppForm, withForm, formContext };
