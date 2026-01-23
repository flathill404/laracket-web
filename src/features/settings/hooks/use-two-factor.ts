import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
	confirmPassword,
	confirmTwoFactor,
	disableTwoFactor,
	enableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
} from "@/features/auth/api";
import { useAuth } from "@/features/auth/hooks/use-auth";

type PendingAction = "enable" | "show-recovery-codes" | null;

export function useTwoFactor() {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const [confirmationCode, setConfirmationCode] = useState("");
	const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
	const [password, setPassword] = useState("");
	const [pendingAction, setPendingAction] = useState<PendingAction>(null);

	const isConfirmed = user?.twoFactorStatus === "enabled";
	const isPending = user?.twoFactorStatus === "pending";

	const { data: recoveryCodes, refetch: refetchRecoveryCodes } = useQuery({
		queryKey: ["recovery-codes"],
		queryFn: fetchTwoFactorRecoveryCodes,
		enabled: false,
	});

	const { data: qrCodeSvg } = useQuery({
		queryKey: ["two-factor-qr-code"],
		queryFn: async () => {
			const { svg } = await fetchTwoFactorQrCode();
			return svg;
		},
		enabled: isPending,
	});

	const enableMutation = useMutation({
		mutationFn: enableTwoFactor,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to enable two-factor authentication");
		},
	});

	const confirmPasswordMutation = useMutation({
		mutationFn: confirmPassword,
		onSuccess: () => {
			setConfirmPasswordOpen(false);
			setPassword("");
			if (pendingAction === "enable") {
				enableMutation.mutate();
			} else if (pendingAction === "show-recovery-codes") {
				refetchRecoveryCodes();
			}
			setPendingAction(null);
		},
		onError: () => {
			toast.error("Incorrect password");
		},
	});

	const confirmMutation = useMutation({
		mutationFn: confirmTwoFactor,
		onSuccess: async () => {
			toast.success("Two-factor authentication enabled");
			refetchRecoveryCodes();
			setConfirmationCode("");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to confirm two-factor authentication");
		},
	});

	const disableMutation = useMutation({
		mutationFn: disableTwoFactor,
		onSuccess: () => {
			toast.success("Two-factor authentication disabled");
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
		onError: () => {
			toast.error("Failed to disable two-factor authentication");
		},
	});

	const handleConfirm = () => {
		if (confirmationCode.length === 6) {
			confirmMutation.mutate({ code: confirmationCode });
		}
	};

	const handleEnableClick = () => {
		setPendingAction("enable");
		setConfirmPasswordOpen(true);
	};

	const handleShowRecoveryCodesClick = () => {
		setPendingAction("show-recovery-codes");
		setConfirmPasswordOpen(true);
	};

	const handlePasswordConfirm = () => {
		confirmPasswordMutation.mutate({ password });
	};

	const clearRecoveryCodes = () => {
		queryClient.setQueryData(["recovery-codes"], null);
	};

	return {
		// State
		isConfirmed,
		isPending,
		confirmationCode,
		setConfirmationCode,
		confirmPasswordOpen,
		setConfirmPasswordOpen,
		password,
		setPassword,
		recoveryCodes,
		qrCodeSvg,

		// Mutations
		enableMutation,
		confirmPasswordMutation,
		confirmMutation,
		disableMutation,

		// Actions
		handleConfirm,
		handleEnableClick,
		handleShowRecoveryCodesClick,
		handlePasswordConfirm,
		clearRecoveryCodes,
	};
}
