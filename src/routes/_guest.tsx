import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
	beforeLoad: ({ context, location }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({
				to: "/dashboard",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: GuestLayout,
});

function GuestLayout() {
	return (
		<div className="">
			<Outlet />
		</div>
	);
}
