import { useForm } from "@tanstack/react-form";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, test, vi } from "vitest";
import { render } from "@/test/utils/render";
import { formContext } from "./formContext";
import { SubscribeButton } from "./SubscribeButton";

function TestForm({
	children,
	onSubmit,
}: {
	children: ReactNode;
	onSubmit?: () => Promise<void> | void;
}) {
	const form = useForm({
		onSubmit: onSubmit ?? (() => {}),
	});

	return (
		<formContext.Provider value={form}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				{children}
			</form>
		</formContext.Provider>
	);
}

describe("SubscribeButton", () => {
	test("renders with label", () => {
		render(
			<TestForm>
				<SubscribeButton label="Submit" />
			</TestForm>,
		);

		expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
	});

	test("is disabled when submitting", async () => {
		const user = userEvent.setup();
		let resolveSubmit: () => void;
		const handleSubmit = vi.fn().mockImplementation(() => {
			return new Promise<void>((resolve) => {
				resolveSubmit = resolve;
			});
		});

		render(
			<TestForm onSubmit={handleSubmit}>
				<SubscribeButton label="Save" />
			</TestForm>,
		);

		const button = screen.getByRole("button", { name: "Save" });
		expect(button).not.toBeDisabled();

		await user.click(button);

		expect(handleSubmit).toHaveBeenCalled();
		expect(button).toBeDisabled();

		// Finish submission
		// @ts-expect-error
		resolveSubmit();

		await waitFor(() => {
			expect(button).not.toBeDisabled();
		});
	});
});
