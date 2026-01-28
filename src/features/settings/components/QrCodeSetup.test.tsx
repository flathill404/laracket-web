import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QrCodeSetup } from "./QrCodeSetup";

describe("QrCodeSetup", () => {
	const defaultProps = {
		qrCodeSvg: "<svg>mock-qr</svg>",
		confirmationCode: "",
		onConfirmationCodeChange: vi.fn(),
		onConfirm: vi.fn(),
		isConfirming: false,
		onCancel: vi.fn(),
		isCancelling: false,
	};

	it("renders QR code image", () => {
		render(<QrCodeSetup {...defaultProps} />);
		const qrImage = screen.getByAltText("2FA QR Code");
		expect(qrImage).toBeInTheDocument();
		expect(qrImage).toHaveAttribute(
			"src",
			expect.stringContaining("data:image/svg+xml;utf8,"),
		);
	});

	it("renders instructions", () => {
		render(<QrCodeSetup {...defaultProps} />);
		expect(
			screen.getByText(/To finish enabling two-factor authentication/i),
		).toBeInTheDocument();
	});

	it("calls onConfirmationCodeChange when entering OTP", () => {
		render(<QrCodeSetup {...defaultProps} />);
		// InputOTP slots are rendered as individual inputs or manageable elements
		// Based on the code, they are slots of InputOTP.
		// RTL might see them as multiple inputs depending on implementation.
		// However, the component passes value/onChange to InputOTP.

		// In a real project, InputOTP slots might be aria-hidden or specialized.
		// Let's look for the slots.
		const slots = screen.getAllByRole("textbox"); // InputOTP slots are often textboxes
		fireEvent.change(slots[0], { target: { value: "1" } });
		expect(defaultProps.onConfirmationCodeChange).toHaveBeenCalled();
	});

	it("enables confirm button only when code is 6 digits", () => {
		const { rerender } = render(
			<QrCodeSetup {...defaultProps} confirmationCode="12345" />,
		);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		expect(confirmButton).toBeDisabled();

		rerender(<QrCodeSetup {...defaultProps} confirmationCode="123456" />);
		expect(confirmButton).not.toBeDisabled();
	});

	it("disables confirm button when isConfirming is true", () => {
		render(
			<QrCodeSetup
				{...defaultProps}
				confirmationCode="123456"
				isConfirming={true}
			/>,
		);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		expect(confirmButton).toBeDisabled();
	});

	it("calls onConfirm when clicking confirm button", () => {
		render(<QrCodeSetup {...defaultProps} confirmationCode="123456" />);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		fireEvent.click(confirmButton);
		expect(defaultProps.onConfirm).toHaveBeenCalled();
	});

	it("calls onCancel when clicking cancel button", () => {
		render(<QrCodeSetup {...defaultProps} />);
		const cancelButton = screen.getByRole("button", { name: "Cancel" });
		fireEvent.click(cancelButton);
		expect(defaultProps.onCancel).toHaveBeenCalled();
	});

	it("disables cancel button when isCancelling is true", () => {
		render(<QrCodeSetup {...defaultProps} isCancelling={true} />);
		const cancelButton = screen.getByRole("button", { name: "Cancel" });
		expect(cancelButton).toBeDisabled();
	});
});
