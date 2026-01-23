import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "@/features/auth/components/login-form";

const loginSearchSchema = z.object({
	redirect: z.string().optional(),
});

export const Route = createFileRoute("/_guest/_form/login")({
	validateSearch: loginSearchSchema,
	component: LoginPage,
});

function LoginPage() {
	const search = Route.useSearch();
	return <LoginForm redirect={search.redirect} />;
}
