import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrganization } from "@/features/organizations/api/organizations";
import type { Organization } from "@/features/organizations/types";
import { organizationQueries } from "@/features/organizations/utils/queries";
import { useAppForm } from "@/hooks/useAppForm";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";

const updateOrganizationSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(30, "Name must be 30 characters or less")
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			"Name can only contain letters, numbers, dashes, and underscores",
		),
	displayName: z
		.string()
		.min(1, "Display name is required")
		.max(50, "Display name must be 50 characters or less"),
});

interface OrganizationSettingsFormProps {
	organization: Organization;
}

export function OrganizationSettingsForm({
	organization,
}: OrganizationSettingsFormProps) {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutationWithToast({
		mutationFn: (values: z.infer<typeof updateOrganizationSchema>) =>
			updateOrganization(organization.id, values),
		successMessage: "Organization updated",
		errorMessage: "Failed to update organization",
		onSuccess: (updatedOrganization) => {
			queryClient.setQueryData(
				organizationQueries.detail(organization.id).queryKey,
				updatedOrganization,
			);
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: organization.name,
			displayName: organization.displayName,
		},
		validators: {
			onSubmit: updateOrganizationSchema,
		},
		onSubmit: async ({ value }) => {
			mutate(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="max-w-2xl space-y-8"
		>
			<div className="space-y-4">
				<form.Field name="name">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="name" className="font-medium text-sm">
								Organization Name
							</label>
							<Input
								id="name"
								placeholder="e.g. acme-corp"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<p className="text-muted-foreground text-xs">
								URL-friendly name. Only letters, numbers, dashes, and
								underscores.
							</p>
							{field.state.meta.errors.length > 0 && (
								<p className="text-destructive text-sm">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Field name="displayName">
					{(field) => (
						<div className="flex flex-col gap-2">
							<label htmlFor="displayName" className="font-medium text-sm">
								Display Name
							</label>
							<Input
								id="displayName"
								placeholder="e.g. Acme Corporation"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-destructive text-sm">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<Button type="submit" disabled={isPending}>
				{isPending ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
