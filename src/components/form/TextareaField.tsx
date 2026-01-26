import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "./formContext";

type TextareaFieldProps = {
	label: string;
	placeholder?: string;
	description?: string;
	className?: string;
};

export function TextareaField({
	label,
	placeholder,
	description,
	className,
}: TextareaFieldProps) {
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

			<Textarea
				id={field.name}
				name={field.name}
				value={field.state.value as string}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				placeholder={placeholder}
				className={
					hasError
						? "border-red-500 focus-visible:ring-red-500"
						: (className ?? "")
				}
			/>

			{description && <FieldDescription>{description}</FieldDescription>}

			{hasError && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
