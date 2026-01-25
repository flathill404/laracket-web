import { type Mock, vi } from "vitest";
import { client } from "@/lib/client";

type MockClient = {
	[K in keyof typeof client]: Mock<
		(...args: Parameters<(typeof client)[K]>) => Promise<Partial<Response>>
	>;
};

export const getMockClient = () => vi.mocked(client) as unknown as MockClient;
