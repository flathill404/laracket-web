import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
	forgotPassword,
	login,
	logout,
	register,
	resetPassword,
	sendVerificationEmail,
	twoFactorChallenge,
} from "@/features/auth/api";
import { authQueries } from "../utils/queries";

export const useAuthActions = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const sendVerificationEmailMutation = useMutation({
		mutationFn: sendVerificationEmail,
	});

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.setQueryData(authQueries.user().queryKey, null);
			navigate({ to: "/login" });
		},
	});

	const twoFactorChallengeMutation = useMutation({
		mutationFn: twoFactorChallenge,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	const forgotPasswordMutation = useMutation({
		mutationFn: forgotPassword,
	});

	const resetPasswordMutation = useMutation({
		mutationFn: resetPassword,
	});

	const registerMutation = useMutation({
		mutationFn: register,
		onSuccess: async () => {
			await queryClient.invalidateQueries(authQueries.user());
		},
	});

	// TODO: Move profile updates to useSettingsActions if/when profile is moved to settings
	// For now, they are not included here as per the task to just refactor existing auth structure

	return {
		login: loginMutation,
		logout: logoutMutation,
		twoFactorChallenge: twoFactorChallengeMutation,
		forgotPassword: forgotPasswordMutation,
		resetPassword: resetPasswordMutation,
		register: registerMutation,
		sendVerificationEmail: sendVerificationEmailMutation,
	};
};
