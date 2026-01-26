import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AuthenticatedNotFound } from "@/components/common/AuthenticatedNotFound";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { userQueryOptions } from "@/features/auth/utils/queries";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { projectQueries } from "@/features/projects/utils/queries";
import { teamQueries } from "@/features/teams/utils/queries";

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

		// Load projects, teams, and organizations for sidebar
		const promises = [
			context.queryClient.ensureQueryData(projectQueries.list(user.id)),
			context.queryClient.ensureQueryData(teamQueries.list(user.id)),
			context.queryClient.ensureQueryData(organizationQueries.list()),
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

	const { data: projects } = useSuspenseQuery(projectQueries.list(userId));
	const { data: teams } = useSuspenseQuery(teamQueries.list(userId));
	const { data: organizations } = useSuspenseQuery(organizationQueries.list());

	// We can safely assume user is not null here because of beforeLoad check
	// But typescript might complain if type includes null (and useAuth returns user | undefined)
	if (!user) return null;

	return (
		<div className="flex h-screen flex-col bg-background">
			<Header user={user} isVerified={isVerified} logout={logout} />

			<div className="flex flex-1 overflow-hidden">
				{isVerified && (
					<Sidebar
						projects={projects}
						teams={teams}
						organizations={organizations}
					/>
				)}

				<main className="flex flex-1 flex-col overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
