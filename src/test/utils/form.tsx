import { useForm } from "@tanstack/react-form";
import type { ReactNode } from "react";
import { fieldContext, formContext } from "@/components/form/formContext";

export function TestFieldWrapper<T>({
	children,
	defaultValue,
	validate,
}: {
	children: ReactNode;
	defaultValue: T;
	validate?: (value: T) => string | undefined;
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
							const error = validate(value as T);
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

export function TestFormWrapper({
	children,
	onSubmit,
}: {
	children: ReactNode;
	onSubmit?: () => Promise<void> | void;
}) {
	const form = useForm({
		onSubmit: onSubmit ?? (() => {}),
	});

	return (
		<formContext.Provider value={form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				{children}
			</form>
		</formContext.Provider>
	);
}
