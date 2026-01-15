import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { client } from "@/lib/api/client";
import { z } from "zod";

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
});

const fetchUser = async () => {
	const res = await client.get("/api/user");
	const user = await res.json();
	return userSchema.parse(user);
};

export const useAuth = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: fetchUser,
		retry: false,
		staleTime: Infinity,
	});

	const loginMutation = useMutation({
		mutationFn: async (credentials: { email: string; password: string }) => {
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
