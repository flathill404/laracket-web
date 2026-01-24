import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/lib/errors";
import { queryKeys } from "@/lib/query-keys";
import { fetchUser } from "../api";
import { userQueryOptions } from "./auth";

vi.mock("../api", () => ({
	fetchUser: vi.fn(),
}));

vi.mock("@/lib/errors", () => ({
	UnauthorizedError: class extends Error {},
}));

describe("auth lib", () => {
	it("userQueryOptions success", async () => {
		const mockUser = { id: 1, name: "Test" };
		(fetchUser as any).mockResolvedValue(mockUser);

		expect(userQueryOptions.queryKey).toEqual(queryKeys.user());
		// @ts-expect-error
		const result = await userQueryOptions.queryFn();
		expect(result).toEqual(mockUser);
		expect(fetchUser).toHaveBeenCalled();
	});

	it("userQueryOptions unauthorized", async () => {
		(fetchUser as any).mockRejectedValue(new UnauthorizedError());
		// @ts-expect-error
		const result = await userQueryOptions.queryFn();
		expect(result).toBeNull();
	});

	it("userQueryOptions other error", async () => {
		const error = new Error("Boom");
		(fetchUser as any).mockRejectedValue(error);
		// @ts-expect-error
		await expect(userQueryOptions.queryFn()).rejects.toThrow("Boom");
	});
});
