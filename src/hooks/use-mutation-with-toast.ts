import {
	type DefaultError,
	type QueryKey,
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type ToastMessage<TData, TVariables> =
	| string
	| ((data: TData, variables: TVariables) => string);

interface MutationWithToastOptions<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
> extends Omit<
		UseMutationOptions<TData, TError, TVariables, TContext>,
		"onSuccess" | "onError"
	> {
	successMessage: ToastMessage<TData, TVariables>;
	errorMessage: string;
	invalidateKeys?: QueryKey[];
	onSuccess?: (data: TData, variables: TVariables) => void;
	onError?: (error: TError, variables: TVariables) => void;
}

export function useMutationWithToast<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
>({
	successMessage,
	errorMessage,
	invalidateKeys,
	onSuccess,
	onError,
	...options
}: MutationWithToastOptions<TData, TError, TVariables, TContext>) {
	const queryClient = useQueryClient();

	return useMutation<TData, TError, TVariables, TContext>({
		...options,
		onSuccess: (data, variables) => {
			const message =
				typeof successMessage === "function"
					? successMessage(data, variables)
					: successMessage;
			toast.success(message);

			if (invalidateKeys) {
				for (const key of invalidateKeys) {
					queryClient.invalidateQueries({ queryKey: key });
				}
			}

			onSuccess?.(data, variables);
		},
		onError: (error, variables) => {
			toast.error(errorMessage);
			onError?.(error, variables);
		},
	});
}
