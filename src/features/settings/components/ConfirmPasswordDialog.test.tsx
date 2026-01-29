import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ConfirmPasswordDialog } from "./ConfirmPasswordDialog";

describe("ConfirmPasswordDialog", () => {
	const defaultProps = {
		open: true,
		onOpenChange: vi.fn(),
		password: "",
		onPasswordChange: vi.fn(),
		onConfirm: vi.fn(),
		isConfirming: false,
	};

	it("renders when open", () => {
		render(<ConfirmPasswordDialog {...defaultProps} />);
		expect(screen.getByText("Confirm Password")).toBeInTheDocument();
		expect(
			screen.getByText(
				"For your security, please confirm your password to continue.",
			),
		).toBeInTheDocument();
	});

	it("calls onPasswordChange when typing", () => {
		render(<ConfirmPasswordDialog {...defaultProps} />);
		const input = screen.getByPlaceholderText("Password");
		fireEvent.change(input, { target: { value: "new-password" } });
		expect(defaultProps.onPasswordChange).toHaveBeenCalledWith("new-password");
	});

	it("calls onConfirm when clicking the confirm button", () => {
		render(<ConfirmPasswordDialog {...defaultProps} password="password123" />);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		fireEvent.click(confirmButton);
		expect(defaultProps.onConfirm).toHaveBeenCalled();
	});

	it("calls onConfirm when pressing the Enter key", () => {
		render(<ConfirmPasswordDialog {...defaultProps} password="password123" />);
		const input = screen.getByPlaceholderText("Password");
		fireEvent.keyDown(input, { key: "Enter" });
		expect(defaultProps.onConfirm).toHaveBeenCalled();
	});

	it("disables the confirm button when isConfirming is true", () => {
		render(
			<ConfirmPasswordDialog
				{...defaultProps}
				password="password123"
				isConfirming={true}
			/>,
		);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		expect(confirmButton).toBeDisabled();
	});

	it("disables the confirm button when the password is empty", () => {
		render(<ConfirmPasswordDialog {...defaultProps} password="" />);
		const confirmButton = screen.getByRole("button", { name: "Confirm" });
		expect(confirmButton).toBeDisabled();
	});

	it("calls onOpenChange(false) when clicking cancel", () => {
		render(<ConfirmPasswordDialog {...defaultProps} />);
		const cancelButton = screen.getByRole("button", { name: "Cancel" });
		fireEvent.click(cancelButton);
		expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
	});
});
