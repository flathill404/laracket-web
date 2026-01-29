import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EnabledState } from "./EnabledState";

const defaultProps = {
	recoveryCodes: undefined,
	onShowRecoveryCodes: vi.fn(),
	onDisable: vi.fn(),
	isDisabling: false,
	onClearRecoveryCodes: vi.fn(),
};

describe("EnabledState", () => {
	it("renders the enabled message", () => {
		render(<EnabledState {...defaultProps} />);

		expect(
			screen.getByText("You have enabled two-factor authentication."),
		).toBeInTheDocument();
	});

	it("renders the description about Google Authenticator", () => {
		render(<EnabledState {...defaultProps} />);

		expect(
			screen.getByText(/Google Authenticator application/),
		).toBeInTheDocument();
	});

	it("renders the Show Recovery Codes button when no recovery codes are displayed", () => {
		render(<EnabledState {...defaultProps} recoveryCodes={undefined} />);

		expect(
			screen.getByRole("button", { name: "Show Recovery Codes" }),
		).toBeInTheDocument();
	});

	it("calls onShowRecoveryCodes when the button is clicked", async () => {
		const user = userEvent.setup();
		const onShowRecoveryCodes = vi.fn();
		render(
			<EnabledState
				{...defaultProps}
				onShowRecoveryCodes={onShowRecoveryCodes}
			/>,
		);

		await user.click(
			screen.getByRole("button", { name: "Show Recovery Codes" }),
		);

		expect(onShowRecoveryCodes).toHaveBeenCalledTimes(1);
	});

	it("renders the Disable button", () => {
		render(<EnabledState {...defaultProps} />);

		expect(screen.getByRole("button", { name: "Disable" })).toBeInTheDocument();
	});

	it("renders recovery codes when provided", () => {
		const recoveryCodes = ["CODE1", "CODE2", "CODE3"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(screen.getByText("CODE1")).toBeInTheDocument();
		expect(screen.getByText("CODE2")).toBeInTheDocument();
		expect(screen.getByText("CODE3")).toBeInTheDocument();
	});

	it("does not render the Show Recovery Codes button when recovery codes are displayed", () => {
		const recoveryCodes = ["CODE1"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(
			screen.queryByRole("button", { name: "Show Recovery Codes" }),
		).not.toBeInTheDocument();
	});

	it("renders the Done button in the recovery codes display", () => {
		const recoveryCodes = ["CODE1"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("calls onClearRecoveryCodes when Done is clicked", async () => {
		const user = userEvent.setup();
		const onClearRecoveryCodes = vi.fn();
		render(
			<EnabledState
				{...defaultProps}
				recoveryCodes={["CODE1"]}
				onClearRecoveryCodes={onClearRecoveryCodes}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Done" }));

		expect(onClearRecoveryCodes).toHaveBeenCalledTimes(1);
	});
});
