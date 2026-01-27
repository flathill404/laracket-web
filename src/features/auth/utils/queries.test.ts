import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/lib/errors";
import { queryKeys } from "@/lib/queryKeys";
import { fetchUser } from "../api";
import { authQueries } from "./queries";

vi.mock("../api", () => ({
	fetchUser: vi.fn(),
}));

vi.mock("@/lib/errors", () => ({
	UnauthorizedError: class extends Error {},
}));

const mockFetchUser = vi.mocked(fetchUser);

describe("auth queries", () => {
	it("userQueryOptions success", async () => {
		const mockUser = { id: 1, name: "Test" };
		mockFetchUser.mockResolvedValue(
			mockUser as unknown as Awaited<ReturnType<typeof fetchUser>>,
		);

		const options = authQueries.user();
		expect(options.queryKey).toEqual(queryKeys.user());
		// @ts-expect-error
		const result = await options.queryFn();
		expect(result).toEqual(mockUser);
		expect(fetchUser).toHaveBeenCalled();
	});

	it("userQueryOptions unauthorized", async () => {
		mockFetchUser.mockRejectedValue(new UnauthorizedError());
		const options = authQueries.user();
		// @ts-expect-error
		const result = await options.queryFn();
		expect(result).toBeNull();
	});

	it("userQueryOptions other error", async () => {
		const error = new Error("Boom");
		mockFetchUser.mockRejectedValue(error);
		const options = authQueries.user();
		// @ts-expect-error
		await expect(options.queryFn()).rejects.toThrow("Boom");
	});
});
