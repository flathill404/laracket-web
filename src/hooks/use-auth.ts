import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { client } from "@/lib/api/client";
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
		mutationFn: async (credentials: z.infer<typeof loginSchema>) => {
			await client.get("/sanctum/csrf-cookie");
			await client.post("/login", credentials);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: async () => {
			await client.post("/logout");
		},
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			navigate({ to: "/login" });
		},
	});

	return {
		user,
		isAuthenticated: !!user,
		isLoading,
		login: loginMutation.mutateAsync,
		logout: logoutMutation.mutateAsync,
	};
};
