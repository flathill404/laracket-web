import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "./formContext";

type InputFieldProps = {
	label: string;
	placeholder?: string;
	description?: string;
	type?: string;
};

export function InputField({
	label,
	placeholder,
	description,
	type = "text",
}: InputFieldProps) {
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
