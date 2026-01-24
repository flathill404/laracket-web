import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "@/features/settings/components/password-form";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { TwoFactorForm } from "@/features/settings/components/two-factor-form";

export const Route = createFileRoute("/_authenticated/settings")({
	component: Settings,
});

function Settings() {
	return (
		<div className="flex h-full flex-col bg-background">
			<div className="flex-1 overflow-auto p-6">
				<div className="mx-auto max-w-4xl space-y-8">
					<div>
						<h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
						<p className="text-muted-foreground text-sm">
							Manage your account settings and preferences.
						</p>
					</div>
					<div className="grid gap-8">
						<ProfileForm />
						<PasswordForm />
						<TwoFactorForm />
					</div>
				</div>
			</div>
		</div>
	);
}
