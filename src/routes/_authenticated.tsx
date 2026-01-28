import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Suspense } from "react";
import { AuthenticatedNotFound } from "@/components/common/AuthenticatedNotFound";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarSkeleton } from "@/components/layout/SidebarSkeleton";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { authQueries } from "@/features/auth/utils/queries";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { projectQueries } from "@/features/projects/utils/queries";
import { teamQueries } from "@/features/teams/utils/queries";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context, location }) => {
		const queryClient = context.queryClient;
		const user = await queryClient.ensureQueryData(authQueries.user());

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

		// Secondary: Start fetching sidebar data, but don't block navigation
		queryClient.prefetchQuery(projectQueries.list(user.id));
		queryClient.prefetchQuery(teamQueries.list(user.id));
		queryClient.prefetchQuery(organizationQueries.list());
	},
	component: AuthLayout,
	notFoundComponent: AuthenticatedNotFound,
});

function AuthLayout() {
	const { data: user } = useSuspenseQuery(authQueries.user());
	const { logout } = useAuthActions();
	const isVerified = !!user?.emailVerifiedAt;

	if (!user) return null;

	return (
		<div className="flex h-screen flex-col bg-background">
			<Header user={user} isVerified={isVerified} logout={logout.mutate} />

			<div className="flex flex-1 overflow-hidden">
				{isVerified && (
					<Suspense fallback={<SidebarSkeleton />}>
						<SuspenseSidebar userId={user.id} />
					</Suspense>
				)}

				<main className="flex flex-1 flex-col overflow-hidden">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

function SuspenseSidebar({ userId }: { userId: string }) {
	const { data: projects } = useSuspenseQuery(projectQueries.list(userId));
	const { data: teams } = useSuspenseQuery(teamQueries.list(userId));
	const { data: organizations } = useSuspenseQuery(organizationQueries.list());

	return (
		<Sidebar projects={projects} teams={teams} organizations={organizations} />
	);
}
