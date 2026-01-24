import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "@/features/auth/utils/queries";

export const Route = createFileRoute("/_guest")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.ensureQueryData(userQueryOptions);
		if (user) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: GuestLayout,
});

function GuestLayout() {
	return (
		<div className="min-h-screen bg-background font-sans antialiased">
			<Outlet />
		</div>
	);
}
