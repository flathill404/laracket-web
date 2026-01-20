import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmail } from "@/features/auth/components/VerifyEmail";

export const Route = createFileRoute("/_authenticated/verify-email")({
	component: VerifyEmail,
});
