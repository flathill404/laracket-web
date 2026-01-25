import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render, renderHook } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { type Mock, vi } from "vitest";
import { client } from "@/lib/client";

function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});
}

interface WrapperProps {
	children: ReactNode;
}

function AllTheProviders({ children }: WrapperProps) {
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

type MockClient = {
	[K in keyof typeof client]: Mock<
		(...args: Parameters<(typeof client)[K]>) => Promise<Partial<Response>>
	>;
};

const getMockClient = () => vi.mocked(client) as unknown as MockClient;

export * from "@testing-library/react";
export {
	customRender as render,
	customRenderHook as renderHook,
	createTestQueryClient,
	getMockClient,
};
