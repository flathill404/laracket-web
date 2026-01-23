import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthenticatedNotFound } from "@/components/common/authenticated-not-found";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { userQueryOptions } from "@/features/auth/lib/auth";
import { projectsQueryOptions } from "@/features/projects/lib/projects";
import { teamsQueryOptions } from "@/features/teams/lib/teams";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.ensureQueryData(userQueryOptions);

		// If the user is not logged in, redirect to the login page
		if (!user) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}

		// If the user is not verified, redirect to the verify-email page
		if (!user.emailVerifiedAt) {
			if (location.pathname !== "/verify-email") {
				throw redirect({
					to: "/verify-email",
				});
			}
		}

		// Load projects and teams for sidebar
		const promises = [
			context.queryClient.ensureQueryData(projectsQueryOptions(user.id)),
			context.queryClient.ensureQueryData(teamsQueryOptions(user.id)),
		];
		await Promise.all(promises);
	},
	component: AuthLayout,
	notFoundComponent: AuthenticatedNotFound,
});

function AuthLayout() {
	const { user, logout } = useAuth();
	const userId = user?.id ?? "";
	const isVerified = !!user?.emailVerifiedAt; // Derived state

	const { data: projects } = useSuspenseQuery(projectsQueryOptions(userId));
	const { data: teams } = useSuspenseQuery(teamsQueryOptions(userId));

	// We can safely assume user is not null here because of beforeLoad check
	// But typescript might complain if type includes null (and useAuth returns user | undefined)
	if (!user) return null;

	return (
		<div className="flex h-screen flex-col bg-background">
			<Header user={user} isVerified={isVerified} logout={logout} />

			<div className="flex flex-1 overflow-hidden">
				{isVerified && <Sidebar projects={projects} teams={teams} />}

				<main className="flex flex-1 flex-col overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
