import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecoveryCodesDisplay } from "./recovery-codes-display";

const mockRecoveryCodes = [
	"ABCD-1234",
	"EFGH-5678",
	"IJKL-9012",
	"MNOP-3456",
	"QRST-7890",
	"UVWX-1234",
	"YZAB-5678",
	"CDEF-9012",
];

describe("RecoveryCodesDisplay", () => {
	it("should render all recovery codes", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		for (const code of mockRecoveryCodes) {
			expect(screen.getByText(code)).toBeInTheDocument();
		}
	});

	it("should render title", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		expect(screen.getByText("Recovery Codes")).toBeInTheDocument();
	});

	it("should render description text", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		expect(
			screen.getByText(
				/Store these recovery codes in a secure password manager/,
			),
		).toBeInTheDocument();
	});

	it("should render Done button", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("should call onDone when Done button is clicked", async () => {
		const user = userEvent.setup();
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Done" }));

		expect(onDone).toHaveBeenCalledTimes(1);
	});

	it("should render empty state when no recovery codes", () => {
		const onDone = vi.fn();
		render(<RecoveryCodesDisplay recoveryCodes={[]} onDone={onDone} />);

		expect(screen.getByText("Recovery Codes")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("should render codes in monospace font", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		// The grid container has font-mono class
		const gridContainer = document.querySelector(".font-mono");
		expect(gridContainer).toBeInTheDocument();
	});
});
