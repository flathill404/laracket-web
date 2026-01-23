import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GuestFormLayout } from "@/components/layout/guest-form-layout";

export const Route = createFileRoute("/_guest/_form")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<GuestFormLayout>
			<Outlet />
		</GuestFormLayout>
	);
}
