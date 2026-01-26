import { Button } from "@/components/ui/button";
import { useFormContext } from "./formContext";

type SubscribeButtonProps = {
	label: string;
};

export function SubscribeButton({ label }: SubscribeButtonProps) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => <Button disabled={isSubmitting}>{label}</Button>}
		</form.Subscribe>
	);
}
