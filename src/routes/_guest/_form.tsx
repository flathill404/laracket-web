import { createFileRoute, Outlet } from "@tanstack/react-router";
import { GuestFormLayout } from "@/components/layout/GuestFormLayout";

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
