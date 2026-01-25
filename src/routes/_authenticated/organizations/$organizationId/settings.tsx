import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { OrganizationSettingsForm } from "@/features/organizations/components/OrganizationSettingsForm";
import { organizationQueries } from "@/features/organizations/utils/queries";

export const Route = createFileRoute(
	"/_authenticated/organizations/$organizationId/settings",
)({
	loader: async ({ context, params }) => {
		return context.queryClient.ensureQueryData(
			organizationQueries.detail(params.organizationId),
		);
	},
	component: OrganizationSettings,
});

function OrganizationSettings() {
	const params = Route.useParams();
	const { data: organization } = useSuspenseQuery(
		organizationQueries.detail(params.organizationId),
	);

	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<div className="space-y-6">
					<div>
						<h2 className="font-bold text-2xl tracking-tight">Settings</h2>
						<p className="text-muted-foreground text-sm">
							Manage your organization settings.
						</p>
					</div>
					<OrganizationSettingsForm organization={organization} />
				</div>
			</div>
		</div>
	);
}
