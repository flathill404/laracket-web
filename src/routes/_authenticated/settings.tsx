import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "./settings/-password-form";
import { ProfileForm } from "./settings/-profile-form";
import { TwoFactorForm } from "./settings/-two-factor-form";

export const Route = createFileRoute("/_authenticated/settings")({
	component: Settings,
});

function Settings() {
	return (
		<div className="flex-1 w-full overflow-y-auto">
			<div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto">
				<h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
				<div className="flex flex-col gap-8">
					<ProfileForm />
					<PasswordForm />
					<TwoFactorForm />
				</div>
			</div>
		</div>
	);
}
