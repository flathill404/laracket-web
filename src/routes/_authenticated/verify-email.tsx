import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmail } from "@/features/auth/components/verify-email";

export const Route = createFileRoute("/_authenticated/verify-email")({
	component: VerifyEmail,
});
