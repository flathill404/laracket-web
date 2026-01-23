import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
	forgotPassword,
	login,
	loginInputSchema,
	logout,
	register,
	resetPassword,
	twoFactorChallenge,
} from "@/features/auth/api/auth";
import { userQueryOptions } from "../lib/auth";

export const loginSchema = loginInputSchema;

export const useAuth = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: user, isLoading } = useQuery(userQueryOptions);

	const loginMutation = useMutation({
		mutationFn: login,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			navigate({ to: "/login" });
		},
	});

	const twoFactorChallengeMutation = useMutation({
		mutationFn: twoFactorChallenge,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["user"] });
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
			await queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	return {
		user,
		isAuthenticated: !!user,
		isLoading,
		login: loginMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
		twoFactorChallenge: twoFactorChallengeMutation.mutateAsync,
		forgotPassword: forgotPasswordMutation.mutateAsync,
		resetPassword: resetPasswordMutation.mutateAsync,
		register: registerMutation.mutateAsync,
	};
};
