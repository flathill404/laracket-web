import { createFileRoute } from "@tanstack/react-router";
import { TwoFactorChallengeForm } from "@/features/auth/components/TwoFactorChallengeForm";

export const Route = createFileRoute("/_guest/_form/two-factor-challenge")({
	component: TwoFactorChallengePage,
});

function TwoFactorChallengePage() {
	return <TwoFactorChallengeForm />;
}
