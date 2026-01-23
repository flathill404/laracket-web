import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "@/features/settings/components/password-form";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { TwoFactorForm } from "@/features/settings/components/two-factor-form";

export const Route = createFileRoute("/_authenticated/settings")({
	component: Settings,
});

function Settings() {
	return (
		<div className="w-full flex-1 overflow-y-auto">
			<div className="mx-auto flex max-w-4xl flex-col gap-8 p-8">
				<h1 className="font-semibold text-2xl tracking-tight">Settings</h1>
				<div className="flex flex-col gap-8">
					<ProfileForm />
					<PasswordForm />
					<TwoFactorForm />
				</div>
			</div>
		</div>
	);
}
