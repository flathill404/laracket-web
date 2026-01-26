import { createFormHook } from "@tanstack/react-form";
import { CheckboxField } from "@/components/form/CheckboxField";
import { fieldContext, formContext } from "@/components/form/formContext";
import { InputField } from "@/components/form/InputField";
import { SubscribeButton } from "@/components/form/SubscribeButton";
import { TextareaField } from "@/components/form/TextareaField";

const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		InputField,
		CheckboxField,
		TextareaField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

export { useAppForm, withForm, formContext };
