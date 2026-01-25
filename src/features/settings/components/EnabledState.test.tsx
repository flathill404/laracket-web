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
	it("should render enabled message", () => {
		render(<EnabledState {...defaultProps} />);

		expect(
			screen.getByText("You have enabled two-factor authentication."),
		).toBeInTheDocument();
	});

	it("should render description about Google Authenticator", () => {
		render(<EnabledState {...defaultProps} />);

		expect(
			screen.getByText(/Google Authenticator application/),
		).toBeInTheDocument();
	});

	it("should render Show Recovery Codes button when no recovery codes displayed", () => {
		render(<EnabledState {...defaultProps} recoveryCodes={undefined} />);

		expect(
			screen.getByRole("button", { name: "Show Recovery Codes" }),
		).toBeInTheDocument();
	});

	it("should call onShowRecoveryCodes when button is clicked", async () => {
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

	it("should render Disable button", () => {
		render(<EnabledState {...defaultProps} />);

		expect(screen.getByRole("button", { name: "Disable" })).toBeInTheDocument();
	});

	it("should render recovery codes when provided", () => {
		const recoveryCodes = ["CODE1", "CODE2", "CODE3"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(screen.getByText("CODE1")).toBeInTheDocument();
		expect(screen.getByText("CODE2")).toBeInTheDocument();
		expect(screen.getByText("CODE3")).toBeInTheDocument();
	});

	it("should not render Show Recovery Codes button when recovery codes are displayed", () => {
		const recoveryCodes = ["CODE1"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(
			screen.queryByRole("button", { name: "Show Recovery Codes" }),
		).not.toBeInTheDocument();
	});

	it("should render Done button in recovery codes display", () => {
		const recoveryCodes = ["CODE1"];
		render(<EnabledState {...defaultProps} recoveryCodes={recoveryCodes} />);

		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("should call onClearRecoveryCodes when Done is clicked", async () => {
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
