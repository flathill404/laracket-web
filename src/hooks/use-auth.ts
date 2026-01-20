import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { login, logout, twoFactorChallenge } from "@/api/auth";
import { userQueryOptions } from "@/lib/auth";

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	remember: z.boolean().default(false),
});

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

	return {
		user,
		isAuthenticated: !!user,
		isLoading,
		login: loginMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
		twoFactorChallenge: twoFactorChallengeMutation.mutateAsync,
	};
};
