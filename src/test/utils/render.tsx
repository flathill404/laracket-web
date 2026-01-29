import { QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render, renderHook } from "@testing-library/react";

// export {
// 	act,
// 	cleanup,
// 	fireEvent,
// 	screen,
// 	waitFor,
// 	within,
// } from "@testing-library/react";

import type { ReactElement, ReactNode } from "react";
import { createTestQueryClient } from "./queryClient";

interface WrapperProps {
	children: ReactNode;
}

export function AllTheProviders({ children }: WrapperProps) {
	const queryClient = createTestQueryClient();
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

const customRender = (
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

const customRenderHook = <Result, Props>(
	render: (initialProps: Props) => Result,
	options?: Omit<RenderOptions, "wrapper">,
) => renderHook(render, { wrapper: AllTheProviders, ...options });

export { customRender as render, customRenderHook as renderHook };
