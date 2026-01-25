import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const Route = createFileRoute("/_guest/_form/register")({
	component: RegisterPage,
});

function RegisterPage() {
	return <RegisterForm />;
}
