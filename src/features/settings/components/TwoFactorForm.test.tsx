import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTwoFactor } from "../hooks/useTwoFactor";
import { TwoFactorForm } from "./TwoFactorForm";

// Mock hook
vi.mock("../hooks/useTwoFactor", () => ({
	useTwoFactor: vi.fn(),
}));

// Mock sub-components to focus on TwoFactorForm logic
vi.mock("./EnabledState", () => ({
	EnabledState: ({ onDisable }: { onDisable: () => void }) => (
		<div data-testid="enabled-state">
			<button type="button" onClick={onDisable}>
				Disable 2FA
			</button>
		</div>
	),
}));

vi.mock("./DisabledState", () => ({
	DisabledState: ({ onEnable }: { onEnable: () => void }) => (
		<div data-testid="disabled-state">
			<button type="button" onClick={onEnable}>
				Enable 2FA
			</button>
		</div>
	),
}));

describe("TwoFactorForm", () => {
	const mockUseTwoFactor = {
		isConfirmed: false,
		isPending: false,
		confirmationCode: "",
		setConfirmationCode: vi.fn(),
		confirmPasswordOpen: false,
		setConfirmPasswordOpen: vi.fn(),
		password: "",
		setPassword: vi.fn(),
		recoveryCodes: null,
		qrCodeSvg: null,
		enableMutation: { mutate: vi.fn(), isPending: false },
		confirmPasswordMutation: { mutate: vi.fn(), isPending: false },
		confirmMutation: { mutate: vi.fn(), isPending: false },
		disableMutation: { mutate: vi.fn(), isPending: false },
		handleConfirm: vi.fn(),
		handleEnableClick: vi.fn(),
		handleShowRecoveryCodesClick: vi.fn(),
		handlePasswordConfirm: vi.fn(),
		clearRecoveryCodes: vi.fn(),
	};

	beforeEach(() => {
		vi.mocked(useTwoFactor).mockReturnValue(
			mockUseTwoFactor as unknown as ReturnType<typeof useTwoFactor>,
		);
	});

	it("renders DisabledState when 2FA is not confirmed", () => {
		render(<TwoFactorForm />);
		expect(screen.getByTestId("disabled-state")).toBeInTheDocument();
		expect(screen.queryByTestId("enabled-state")).not.toBeInTheDocument();
	});

	it("renders EnabledState when 2FA is confirmed", () => {
		vi.mocked(useTwoFactor).mockReturnValue({
			...mockUseTwoFactor,
			isConfirmed: true,
		} as unknown as ReturnType<typeof useTwoFactor>);
		render(<TwoFactorForm />);
		expect(screen.getByTestId("enabled-state")).toBeInTheDocument();
		expect(screen.queryByTestId("disabled-state")).not.toBeInTheDocument();
	});

	it("calls handleEnableClick from DisabledState", () => {
		render(<TwoFactorForm />);
		const enableButton = screen.getByRole("button", { name: "Enable 2FA" });
		fireEvent.click(enableButton);
		expect(mockUseTwoFactor.handleEnableClick).toHaveBeenCalled();
	});

	it("calls disableMutation from EnabledState", () => {
		vi.mocked(useTwoFactor).mockReturnValue({
			...mockUseTwoFactor,
			isConfirmed: true,
		} as unknown as ReturnType<typeof useTwoFactor>);
		render(<TwoFactorForm />);
		const disableButton = screen.getByRole("button", { name: "Disable 2FA" });
		fireEvent.click(disableButton);
		expect(mockUseTwoFactor.disableMutation.mutate).toHaveBeenCalled();
	});
});
