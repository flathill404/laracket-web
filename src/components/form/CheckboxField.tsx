import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "./formContext";

type CheckboxFieldProps = {
	label: string;
};

export function CheckboxField({ label }: CheckboxFieldProps) {
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
