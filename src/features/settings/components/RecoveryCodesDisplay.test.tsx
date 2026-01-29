import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecoveryCodesDisplay } from "./RecoveryCodesDisplay";

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
	it("renders all recovery codes", () => {
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

	it("renders the title", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		expect(screen.getByText("Recovery Codes")).toBeInTheDocument();
	});

	it("renders the description text", () => {
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

	it("renders the Done button", () => {
		const onDone = vi.fn();
		render(
			<RecoveryCodesDisplay
				recoveryCodes={mockRecoveryCodes}
				onDone={onDone}
			/>,
		);

		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("calls onDone when the Done button is clicked", async () => {
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

	it("renders an empty state when there are no recovery codes", () => {
		const onDone = vi.fn();
		render(<RecoveryCodesDisplay recoveryCodes={[]} onDone={onDone} />);

		expect(screen.getByText("Recovery Codes")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Done" })).toBeInTheDocument();
	});

	it("renders codes in a monospace font", () => {
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
