import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

const resetPasswordSearchSchema = z.object({
	token: z.string(),
	email: z.string().email(),
});

export const Route = createFileRoute("/_guest/reset-password")({
	validateSearch: resetPasswordSearchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	const search = Route.useSearch();
	return <ResetPasswordForm email={search.email} token={search.token} />;
}
