import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Dashboard } from "@/features/dashboard/components/dashboard";

export const Route = createFileRoute("/_authenticated/dashboard")({
	validateSearch: z.object({
		verified: z.boolean().optional().catch(false),
	}),
	component: DashboardPage,
});

function DashboardPage() {
	const { verified } = Route.useSearch();
	const navigate = useNavigate();

	useEffect(() => {
		if (verified) {
			toast.success("Email verified successfully!");
			navigate({
				to: ".",
				search: { verified: undefined },
				replace: true,
			});
		}
	}, [verified, navigate]);

	return <Dashboard />;
}
