import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DisabledState } from "./disabled-state";

const defaultProps = {
	isPending: false,
	qrCodeSvg: undefined,
	confirmationCode: "",
	onConfirmationCodeChange: vi.fn(),
	onConfirm: vi.fn(),
	isConfirming: false,
	onCancel: vi.fn(),
	isCancelling: false,
	onEnable: vi.fn(),
	isEnabling: false,
};

describe("DisabledState", () => {
	it("should render disabled message", () => {
		render(<DisabledState {...defaultProps} />);

		expect(
			screen.getByText("You have not enabled two-factor authentication."),
		).toBeInTheDocument();
	});

	it("should render description about Google Authenticator", () => {
		render(<DisabledState {...defaultProps} />);

		expect(
			screen.getByText(/Google Authenticator application/),
		).toBeInTheDocument();
	});

	it("should render Enable button when not pending", () => {
		render(<DisabledState {...defaultProps} isPending={false} />);

		expect(screen.getByRole("button", { name: "Enable" })).toBeInTheDocument();
	});

	it("should call onEnable when Enable button is clicked", async () => {
		const user = userEvent.setup();
		const onEnable = vi.fn();
		render(<DisabledState {...defaultProps} onEnable={onEnable} />);

		await user.click(screen.getByRole("button", { name: "Enable" }));

		expect(onEnable).toHaveBeenCalledTimes(1);
	});

	it("should disable Enable button when isEnabling is true", () => {
		render(<DisabledState {...defaultProps} isEnabling={true} />);

		expect(screen.getByRole("button", { name: "Enable" })).toBeDisabled();
	});

	it("should render QrCodeSetup when pending and qrCodeSvg is available", () => {
		render(
			<DisabledState
				{...defaultProps}
				isPending={true}
				qrCodeSvg="<svg>mock</svg>"
			/>,
		);

		// Enable button should not be visible when QR setup is shown
		expect(
			screen.queryByRole("button", { name: "Enable" }),
		).not.toBeInTheDocument();
	});

	it("should not render QrCodeSetup when pending but no qrCodeSvg", () => {
		render(
			<DisabledState
				{...defaultProps}
				isPending={true}
				qrCodeSvg={undefined}
			/>,
		);

		// Enable button should still be visible
		expect(screen.getByRole("button", { name: "Enable" })).toBeInTheDocument();
	});
});
