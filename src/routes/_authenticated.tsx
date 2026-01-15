import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { userQueryOptions } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.ensureQueryData(userQueryOptions);
		console.log("auth user", user);
		if (!user) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<div className="">
			<Outlet />
		</div>
	);
}
